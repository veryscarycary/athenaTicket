'use strict'
/*************************
        User SCHEMA
*************************/

const mongoose = require('../config/middleware.js').mongoose;

var schema = new mongoose.Schema({
  title: {
    type:String,
    unique: true
  }
},
{ versionKey: false });

module.exports = mongoose.model('Ticket', schema);