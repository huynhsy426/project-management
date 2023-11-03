const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    tasks: [
        {
            taskId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'tasks',
                required: true
            },
            status: {
                type: String
            },
            start: {
                type: Date
            },
            end: {
                type: Date
            }
        }
    ]
});

const reportModel = mongoose.model('reports', reportSchema);


module.exports = reportModel;