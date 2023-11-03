const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    taskName: {
        type: String,
        required: true
    },
    assignee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    content: {
        type: String,
        required: true
    },
    attachments: {
        type: [
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
        default: undefined
    },
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
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    versions: [
        {
            changeBy: {
                type: mongoose.Schema.Types.ObjectId
            },
            updated_at: {
                type: Date
            },
            old: {
                taskName: {
                    type: String
                },
                assignee: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'users'
                },
                content: {
                    type: String
                },
                attachments: {
                    type: [
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
                    default: undefined
                },
                //  status(trạng thái của task: todo, doing, done, rejected)
                status: {
                    type: String
                },
                // point(trọng số của task để đánh giá độ ưu tiên)
                point: {
                    type: Number,
                    min: [1, 'More than 1 and less than 10'],
                    max: [10, 'More than 1 and less than 10']
                },
                deadline: {
                    type: Date,
                    required: true
                },
            },
            new: {
                taskName: {
                    type: String
                },
                assignee: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'users'
                },
                content: {
                    type: String
                },
                attachments: {
                    type: [
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
                    default: undefined
                },
                //  status(trạng thái của task: todo, doing, done, rejected)
                status: {
                    type: String
                },
                // point(trọng số của task để đánh giá độ ưu tiên)
                point: {
                    type: Number,
                    min: [1, 'More than 1 and less than 10'],
                    max: [10, 'More than 1 and less than 10']
                },
                deadline: {
                    type: Date,
                    required: true
                },
            },
            _id: false
        }
    ]
}, {
    versionKey: false,// You should be aware of the outcome after set to false
    minimize: true,
    timestamps: true
});

taskSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

const taskModel = mongoose.model('tasks', taskSchema);


module.exports = taskModel;