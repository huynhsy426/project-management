const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    age: {
        type: Number,
        required: true,
    },
    roles: {
        type: String,
        required: true,
    },
    userPassword: {
        type: String,
        required: true
    },
    gmail: {
        type: String,
        unique: true,
        required: true
    },
    exp: {
        type: Number,
        required: true
    },
    isBlocked: {
        type: Boolean,
        requierd: true
    },
    depts: [
        {
            deptId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'depts',
                unique: true
            },
            _id: false
        }

    ]
}, {
    versionKey: false // You should be aware of the outcome after set to false
});

const userModel = mongoose.model('users', userSchema);




module.exports = userModel;