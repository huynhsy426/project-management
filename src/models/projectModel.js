const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: true
    },
    deptId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    insTm: {
        type: Date,
        required: false
    },
    updTm: {
        type: Date,
        required: false
    },
    version: {
        type: Number,
        required: false
    },
    leaderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    minExp: {
        type: Number,
        required: true
    },
    completedAt: {
        type: Date,
        required: false
    }
}, {
    versionKey: false // You should be aware of the outcome after set to false
})

const projectModel = mongoose.model('projects', projectSchema);



module.exports = projectModel;