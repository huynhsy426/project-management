const UserModels = require('../models/userModel');

const validateUser = (req, res, next) => {
    console.log("here is")
    const user = {
        username: req.body.username,
        age: req.body.age,
        roles: req.body.roles,
        userPassword: req.body.userPassword,
        gmail: req.body.gmail,
        isBlocked: false
    }
    UserModels.isUserNameAndGmailExist(
        { user },
        function (error, result) {
            if (error) {
                console.log("error here")
                return next(error);
            }

            console.log("Exist here")
            return next();
        });
}

module.exports = {
    validateUser
}