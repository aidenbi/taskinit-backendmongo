"use strict";

var mongoose = require('mongoose');
var FollowSchema = mongoose.Schema({
  Following: {
    type: String,
    required: true
  },
  UserID: {
    type: String,
    required: true
  }
});
module.exports = mongoose.model('Following', FollowSchema);