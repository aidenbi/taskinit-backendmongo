"use strict";

var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 6,
    max: 255
  },
  newpassword: {
    type: String,
    required: false,
    min: 6,
    max: 255
  },
  password: {
    type: String,
    required: true,
    max: 1024,
    min: 6
  },
  date: {
    type: Date,
    "default": Date.now
  }
});
module.exports = mongoose.model('User', userSchema);