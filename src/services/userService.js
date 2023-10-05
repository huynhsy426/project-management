const UserModel = require('../models/userModel');

class UserService {

    constructor() { }

    loginByUser = ({ username, userPassword }, callback) => {
        UserModel.checkUserLogin(
            { username, userPassword }, callback)
    }

    createUser = (user, callback) => {
        UserModel.createUser(user, callback)
    }
}


module.exports = new UserService()



