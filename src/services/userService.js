const UserModel = require('../models/userModel');


const loginByUserService = (user_name, user_password, results) => {
    UserModel.checkUserLogin(
        user_name,
        user_password,
        function (err, result) {
            console.log(result)
            if (err) {
                return results(err, null)
            }
            return results(null, result)
        }
    )
}


const createUserService = (users, results) => {
    UserModel.isUserNameExist(
        users.user_name,
        function (err, result) {
            if (err) {
                return results(err, null)
            }

            if (!result) {
                UserModel.createUser(
                    users,
                    function (err, isRegister) {
                        if (err) {
                            return results(err, null)
                        }
                        return results(null, !isRegister)
                    }
                )
            } else {
                return results(null, result)
            }
        }
    )
}




module.exports = {
    loginByUserService,
    createUserService
};



