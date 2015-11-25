var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var schema = mongoose.Schema({
  name 			: {type: String, default: 'myCode'},
  codeBody		: {type: String},
  approval    :[],
  rejection   :[],
  committed   :{type: Boolean, default: false}
});

module.exports = mongoose.model('Code', schema);
