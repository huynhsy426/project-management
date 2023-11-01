const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tasks',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    ratings: {
        type: Number,
        min: [0, 'More than 0 and less than 5'],
        max: [5, 'More than 0 and less than 5']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }

});

const reportModel = mongoose.model('reports', reportSchema);


module.exports = reportModel;