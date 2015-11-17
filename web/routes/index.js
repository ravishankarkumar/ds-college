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
    console.log(doc);
  });
});

router.get('/mycode', function(req, res, next) {
  Code.find(function(err, doc){
    if(doc){
      res.send(doc[doc.length - 1].codeBody);
    } else {
      res.send("No Code Saved!");
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
    res.send(doc.codeBody);
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