const mongoose = require('mongoose');

const FollowSchema = mongoose.Schema({
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