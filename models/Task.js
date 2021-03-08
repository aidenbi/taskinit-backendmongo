const mongoose = require('mongoose');

const TaskSchema = mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    day: {
        type: String,
        required: true
    },
    reminder: {
        type: Boolean,
        default: false
    },
    Difficulty: {
        type: Number,
        required: true
    },
    Username: {
        type: String,
        required: true
    },
    Completion: {
        type: Boolean,
        default: false
    },
});


module.exports = mongoose.model('Tasks', TaskSchema);