const UserModel = require('../models/userModel');


const loginByUserService = (username, userPassword, callback) => {
    UserModel.checkUserLogin(
        username,
        userPassword,
        function (err, isLogin, result) {
            if (err) {
                return callback(err)
            }
            if (isLogin) {
                return callback(null, isLogin, result)
            } else {
                return callback(null, isLogin)
            }
        }
    )
}


const createUserService = (user, callback) => {
    console.log('createUserService', user)
    UserModel.createUser(
        user,
        function (err, result) {
            if (err) {
                return callback(err);
            }
            return callback(null, result);
        }
    )
}




module.exports = {
    loginByUserService,
    createUserService
};



