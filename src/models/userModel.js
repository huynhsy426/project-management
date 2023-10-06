const connect = require('./connection')

class UserModel {

    constructor(UserModel) {
        this.userId = UserModel.UserId;
        this.username = UserModel.username;
        this.age = UserModel.age;
        this.roles = UserModel.roles;
        this.userPassword = UserModel.userPassword;
        this.gmail = UserModel.gmail;
        this.exp = UserModel.exp;
        this.isBlocked = UserModel.isBlocked;
    }


    // Check user login
    static checkUserLogin(username, userPassword) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * 
            FROM users 
            WHERE username = ? AND userPassword = ?`;

            connect.query(
                sql,
                [username, userPassword],
                (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    if (isEmpty(result)) {
                        return resolve();
                    } else {
                        if (result[0].isBlocked === 1) {
                            // xoa hasLogin, only use result is enough
                            return resolve({ isBlocked: true, result });
                        }
                        return resolve({ isBlocked: false, result });
                    }
                }
            )
        })
    };


    // Create a new user
    static createUser(user) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO users (username, age, roles, userPassword, gmail, exp, isBlocked) 
                         VALUES (?, ?, ?, ?, ? , ?, ?)`;

            connect.query(
                sql,
                [user.username, user.age, user.roles, user.userPassword, user.gmail, user.exp, user.isBlocked],
                (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(result);
                }
            )
        })


    }


    // Check user_name and gmail are exists
    static isUserNameAndGmailExist(user) {
        return new Promise((resolve, reject) => {
            const sql = `select username, gmail 
            FROM users 
            WHERE username = ? or gmail = ?`;

            connect.query(
                sql,
                [user.username, user.gmail],
                (err, result) => {
                    if (err) {
                        console.log("1")
                        return reject(err);
                    }
                    if (isEmpty(result)) {
                        console.log("2")
                        return resolve();
                    }
                    if (result.length === 2) {
                        console.log("3")
                        return reject(new Error("USERNAME_GMAIL_UNIQUE"));
                    } else if (result.length === 1) {
                        console.log("4")
                        if (result.some(item => item.username === user.username && item.gmail === user.gmail)) {
                            return reject(new Error("USERNAME_GMAIL_UNIQUE"));
                        }

                        if (result.some(item => item.username === user.username)) {
                            return reject(new Error("USERNAME_UNIQUE"));
                        }

                        if (result.some(item => item.gmail === user.gmail)) {
                            return reject(new Error("GMAIL_UNIQUE"));
                        }
                    }
                }
            )
        })
    }


    static getUser(userId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT userId, roles, username, age, gmail, exp, isBlocked
                FROM users
                WHERE userId = ? LIMIT 1`;
            connect.query(
                sql,
                userId,
                (err, result) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(result);
                }
            )
        })
    }


};


function isEmpty(obj) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}

module.exports = UserModel;