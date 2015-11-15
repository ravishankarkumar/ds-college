var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var schema = mongoose.Schema({
  name 			: {type: String, default: 'myCode'},
  codeBody		: {type: String}
});

module.exports = mongoose.model('Code', schema);
