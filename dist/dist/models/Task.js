"use strict";

var mongoose = require('mongoose');
var TaskSchema = mongoose.Schema({
  text: {
    type: mongoose.Mixed,
    required: true
  },
  day: {
    type: String,
    required: true
  },
  reminder: {
    type: Boolean,
    "default": false
  },
  Difficulty: {
    type: Number,
    required: true
  },
  Completion: {
    type: Boolean,
    "default": false
  },
  UserID: {
    type: String,
    required: true
  },
  Private: {
    type: Boolean,
    "default": false
  },
  encrypt: {
    type: Boolean,
    "default": false
  }
});
module.exports = mongoose.model('Tasks', TaskSchema);