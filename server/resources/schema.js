'use strict'
const mongoose = require('../config/middleware.js').mongoose;

var schema = new mongoose.Schema({
  title: {
    type:String,
    unique: true
  }, 
  issuePreview: String, 
  customerId: String,
  issue: String,
  solution: String,
  relatedArticles: [String],
  relatedProducts: Object, //keys are products, values are versions
  resolved: Boolean,
  datesOpened: [[Date, String]], 
  datesResolved: [[Date, String]], //date res
  checkedOut: Boolean
},
{ versionKey: false });

module.exports = mongoose.model('Ticket', schema);