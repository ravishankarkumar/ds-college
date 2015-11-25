var express = require('express');
var router = express.Router();
var passport = require('passport');
var Code = require("./models/code.js");


/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.user){
    res.render('index', { title: 'Distributed Systems Lab', user: req.user.local.email });
    console.log(req);
  } else {
    res.render('index', { title: 'Distributed Systems Lab' });
  }
});
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.post('/login', passport.authenticate('local-login', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
}));


router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Sign Up' });
});
router.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
}));

router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});


router.get('/addcode', function(req, res, next) {
  var code = new Code();
  code.codeBody="Code";
  code.save();
  res.render('index', { title: 'Express' });
});

router.get('/code', function(req, res, next) {
  Code.find(function(err, doc){
    res.send(doc);
  });
});

router.get('/codebyid/:id', function(req, res, next) {
  Code.findOne({_id: req.param("id")},function(err, doc){
    res.send(doc.codeBody);
    console.log(doc.codeBody);
  });
});

router.get('/accept/:id', function(req, res, next) {
  Code.findOne({_id: req.param("id")},function(err, doc){
    var idxt = doc.approval.indexOf(req.user.local.email);
    if(doc.approval[idxt] != req.user.local.email){
      doc.approval.push(req.user.local.email);
      console.log("index in approval is"+idxt);
    }    
    var idx = doc.rejection.indexOf(req.user.local.email);
    if(doc.rejection[idx]==req.user.local.email){
      doc.rejection.splice(idx, 1); 
      console.log("index in rejection is"+idx);     
    }
    res.send("OK");
    console.log("Updated Approval and Rejection List are:");
    console.log(doc.approval);
    console.log(doc.rejection);
    updateCommit(doc);
    console.log(doc.committed);
    doc.save();
  });
});

router.get('/reject/:id', function(req, res, next) {
  Code.findOne({_id: req.param("id")},function(err, doc){
    var idxt = doc.rejection.indexOf(req.user.local.email);
    if(doc.rejection[idxt] != req.user.local.email){
      doc.rejection.push(req.user.local.email);
      console.log("index in rejection is"+idxt);
    }
    var idx = doc.approval.indexOf(req.user.local.email);;
    if(doc.approval[idx] == req.user.local.email){
      doc.approval.splice(idx, 1);
      console.log("index in approval is"+idx);
    }
    res.end("OK");
    console.log("Updated Approval and Rejection List are:");
    console.log(doc.approval);
    console.log(doc.rejection);
    updateCommit(doc);
    console.log(doc.committed);
    doc.save();
  });
});

router.get('/forapproval/:codeId', isLoggedIn, function(req, res, next) {
    res.render('index', { title: 'Distributed Systems Lab', user: req.user.local.email, pre:true, fetchId:req.param("codeId") });
});

router.get('/mycode', function(req, res, next) {
  Code.find(function(err, doc){
    var fl=0;
    if(doc){
      //res.send(doc[doc.length - 1].codeBody);
      for(var idx = doc.length -1; idx >= 0; idx--){
        if(doc[idx].committed==true){
          res.end(doc[idx].codeBody);
          fl=1;
        }
      }
    } else{
      res.end("No Code Committed!");      
    }
    if(fl==0){
      res.end("No Code Committed!");  
    }
  });
});
router.post('/mycode', isLoggedIn, function(req, res, next) {
  var code = new Code();
  code.codeBody = req.body.codedata;
  code.name = req.user.local.email;
  code.save();
});

router.get('/mycode-old', function(req, res, next) {
  Code.findOne({_id: "563915b9caf6270518b45f97"},function(err, doc){
    res.end(doc.codeBody);
  });
});
router.post('/mycode-old', function(req, res, next) {
  Code.findOne({_id: "563915b9caf6270518b45f97"},function(err, doc){
    doc.codeBody = req.body.codedata;
    doc.save();
  });
});

module.exports = router;

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();
  // if they aren't redirect them to the home page
  res.redirect('/login');
}

function updateCommit(doc){
  var i=0;
  var admin = ["ravi", "ratan", "sandeep", "saquib"];
  for(var idx in admin){
    var identity = doc.approval.indexOf(admin[idx]);
    if(identity != -1)
      i++;
  }
  if(i>=4){
    doc.committed = true;
  } else {
    doc.committed = false;
  }
}