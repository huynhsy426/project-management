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
                UserModel.checkIsBlocked(
                    result[0].userId,
                    function (error, isBlocked) {
                        if (error) {
                            return callback(err)
                        }
                        return callback(null, isLogin, isBlocked, result)
                    }
                )
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



