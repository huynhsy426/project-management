const connect = require('./connection')

class UserModel {

    constructor(UserModel) {
        this.userId = UserModel.UserId;
        this.full_name = UserModel.full_name;
        this.user_name = UserModel.user_name;
        this.user_password = UserModel.user_password;
        this.email = UserModel.email;
        this.phone = UserModel.phone;
    }


    // Check user login
    static checkUserLogin(user_name, user_password, results) {
        const sql = 'SELECT * FROM users WHERE user_name = ? AND user_password = ?'
        connect.query(
            sql,
            [user_name, user_password],
            (err, result) => {
                if (err) {
                    console.log("error: ", err);
                    return results(err, null);
                }
                return results(null, true, result);
            }
        )
    };

    static createUser(user, results) {
        const sql = "INSERT INTO users (full_name,user_name,user_password,EMAIL,PHONE) values(?,?,?,?,?)";
        connect.query(
            sql,
            [user.full_name, user.user_name, user.user_password, user.email, user.phone],
            (err) => {
                if (err) {
                    console.log("error: ", err);
                    return results(err, null);
                }
                return results(null, true, { ...user });
            }
        )
    }


    // Check user_name
    static isUserNameExist(user_name, results) {
        const sql = "select user_name from users where user_name = ?"
        connect.query(
            sql,
            user_name,
            function (err, result) {
                if (err) {
                    return results(err, null);
                }
                if (isEmpty(result)) {
                    console.log("user_name not exists");
                    return results(null, false);
                } else {
                    console.log("user_name is exists");
                    return results(null, true);
                }
            }
        )
    }



}


function isEmpty(obj) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}

module.exports = UserModel;