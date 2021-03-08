const mongoose = require('mongoose');

const FollowSchema = mongoose.Schema({
    following: {
        type: String,
        required: true
    },
    Username: {
        type: String,
        required: true
    }

});


module.exports = mongoose.model('Following', FollowSchema);