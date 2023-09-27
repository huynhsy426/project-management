const UserModel = require('../models/userModel');


const loginByUserService = ({ username, userPassword }, callback) => {
    UserModel.checkUserLogin(
        { username, userPassword },
        function (err, { hasLogin, isBlocked, result }) {
            if (err) {
                return callback(err)
            }
            return callback(null, { hasLogin, isBlocked, result });
        }
    )
}


const createUserService = (user, callback) => {
    console.log('createUserService', user)
    UserModel.createUser(
        user,
        function (err, { hasCreateUser }) {
            if (err) {
                return callback(err);
            }
            return callback(null, hasCreateUser);
        }
    )
}




module.exports = {
    loginByUserService,
    createUserService
};



