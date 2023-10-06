const UserModel = require('../models/userModel');

class UserService {

    constructor() { }

    loginByUser = (username, userPassword) => {
        return UserModel.checkUserLogin(username, userPassword)
    }

    createUser = (user) => {
        return UserModel.createUser(user);
    }
}


module.exports = new UserService()



