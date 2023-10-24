const mongoose = require('mongoose');

const deptSchema = new mongoose.Schema({
    deptName: {
        type: String,
        unique: true,
        required: true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }
}, {
    versionKey: false // You should be aware of the outcome after set to false
});

const deptModel = mongoose.model('depts', deptSchema);


module.exports = deptModel;