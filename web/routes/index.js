var express = require('express');
var router = express.Router();
var Code = require("./models/code.js");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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

router.get('/mycode', function(req, res, next) {
  Code.findOne({_id: "563915b9caf6270518b45f97"},function(err, doc){
    res.send(doc.codeBody);
  });
});
router.post('/mycode', function(req, res, next) {
  Code.findOne({_id: "563915b9caf6270518b45f97"},function(err, doc){
    doc.codeBody = req.body.codedata;
    doc.save();
  });
});

module.exports = router;
