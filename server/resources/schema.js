'use strict'
const mongoose = require('../config/middleware.js').mongoose;

module.exports = mongoose.model('Ticket', new mongoose.Schema(
  {
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
    authorId: String,
    dateSubmitted: Date,
    datesOpened: [[Date, String]], //dates opened, user Id
    datesResolved: [[Date, String]], //dates resolved, user Id
    checkedOut: Boolean
  },
  { versionKey: false }
));
