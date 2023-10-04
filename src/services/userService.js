const UserModel = require('../models/userModel');

class UserService {

    constructor() { }

    loginByUserService = ({ username, userPassword }, callback) => {
        UserModel.checkUserLogin(
            { username, userPassword },
            function (err, { isBlocked, result }) {
                if (err) {
                    return callback(err)
                }
                return callback(null, { isBlocked, result });
            }
        )
    }

    createUserService = (user, callback) => {
        console.log('createUserService', user)
        UserModel.createUser(
            user,
            function (err, hasCreateUser) {
                if (err) {
                    return callback(err);
                }
                return callback(null, hasCreateUser);
            }
        )
    }
}


module.exports = new UserService()



