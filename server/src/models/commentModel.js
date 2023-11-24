const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tasks',
        required: true
    },
    content: {
        type: String,
    },
}, {
    versionKey: false, // You should be aware of the outcome after set to false
    minimize: true,
    timestamps: true
});

const commentModel = mongoose.model('comments', commentSchema);

module.exports = commentModel;