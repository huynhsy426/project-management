const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    taskName: {
        type: String,
        required: true
    },
    assignee: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }
    },
    content: {
        type: String,
        required: true
    },
    attachments: [
        {
            path: {
                type: String,
                trim: true
            },
            originalname: {
                type: String
            },
            _id: false
        }
    ],
    //  status(trạng thái của task: todo, doing, done, rejected)
    status: {
        type: String,
        required: true
    },
    // point(trọng số của task để đánh giá độ ưu tiên)
    point: {
        type: Number,
        min: [1, 'More than 1 and less than 10'],
        max: [10, 'More than 1 and less than 10'],
        required: true
    },
    create: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        createAt: {
            type: Date,
            required: true
        },
        _id: false
    },
    version: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId
            },
            version: {
                type: Number
            },
            updateTime: {
                type: Date
            },
            content: {
                type: String
            }
        }
    ]
}, {
    versionKey: false,// You should be aware of the outcome after set to false
    minimize: false
});

const taskModel = mongoose.model('tasks', taskSchema);


module.exports = taskModel;