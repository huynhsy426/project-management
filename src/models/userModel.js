const connect = require('./connection')

class UserModel {

    constructor(UserModel) {
        this.userId = UserModel.UserId;
        this.username = UserModel.username;
        this.age = UserModel.age;
        this.roles = UserModel.roles;
        this.userPassword = UserModel.userPassword;
        this.gmail = UserModel.gmail;
        this.isBlocked = UserModel.isBlocked;
    }


    // Check user login
    static checkUserLogin(username, userPassword, callback) {
        const sql = `SELECT * 
                     FROM users 
                     WHERE username = ? AND userPassword = ?`;
        connect.query(
            sql,
            [username, userPassword],
            (err, result) => {
                if (err) {
                    return callback(new Error(err.message));
                }
                if (isEmpty(result)) {
                    return callback(null, false);
                } else {
                    return callback(null, true, result);
                }
            }
        )
    };


    // Create a new user
    static createUser(user, callback) {
        const sql = `INSERT INTO users (username, age, roles, userPassword, gmail) 
                     VALUES (?, ?, ?, ?, ?)`;
        connect.query(
            sql,
            [user.username, user.age, user.roles, user.userPassword, user.gmail],
            (err) => {
                if (err) {
                    return callback(new Error(err.message));
                }
                return callback(null, true);
            }
        )

    }


    // Check user_name and gmail are exists
    static isUserNameAndGmailExist({ user }, callback) {
        const sql = `select username, gmail 
                     FROM users 
                     WHERE username = ? or gmail = ?`
        connect.query(
            sql,
            [user.username, user.gmail],
            function (err, result) {
                if (err) {
                    return callback(err);
                }
                if (isEmpty(result)) {
                    return callback(err, false);
                }
                if (result.length === 2) {
                    return callback(new Error("USERNAME_GMAIL_UNIQUE"));
                } else if (result.length === 1) {
                    for (let index = 0; index < result.length; index++) {
                        if (result[index].username === user.username) {
                            return callback(new Error("USERNAME_UNIQUE"))
                        }
                        return callback(new Error("GMAIL_UNIQUE"))
                    }
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