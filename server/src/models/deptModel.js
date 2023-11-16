const mongoose = require('mongoose');

const deptSchema = new mongoose.Schema({
    deptName: {
        type: String,
        unique: true,
        required: true
    },
    members: [
        {
            memberId: {
                type: mongoose.Schema.Types.ObjectId,
                unique: true,
                ref: 'users',
                required: true
            },
            position: {
                type: String
            },
            _id: false
        }
    ]
}, {
    versionKey: false // You should be aware of the outcome after set to false
});

const deptModel = mongoose.model('depts', deptSchema);


module.exports = deptModel;