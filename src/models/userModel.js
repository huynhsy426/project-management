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
    static checkUserLogin({ username, userPassword }, callback) {
        const sql = `SELECT * 
                     FROM users 
                     WHERE username = ? AND userPassword = ?`;
        connect.query(
            sql,
            [username, userPassword],
            (err, result) => {
                if (err) {
                    return callback(err);
                }

                if (isEmpty(result)) {
                    return callback(null, { hasLogin: false });
                } else {
                    if (result[0].isBlocked === 1) {
                        // xoa hasLogin, only use result is enough
                        return callback(null, { isBlocked: true, result: result });
                    }
                    return callback(null, { isBlocked: false, result: result });
                }
            }
        )
    };


    // Create a new user
    static createUser(user, callback) {
        const sql = `INSERT INTO users (username, age, roles, userPassword, gmail, exp, isBlocked) 
                     VALUES (?, ?, ?, ?, ? , ?, ?)`;
        connect.query(
            sql,
            [user.username, user.age, user.roles, user.userPassword, user.gmail, user.exp, user.isBlocked],
            (err) => {
                if (err) {
                    return callback(err);
                }
                return callback(null, { hasCreateUser: true });
            }
        )

    }


    // Check user_name and gmail are exists
    static isUserNameAndGmailExist(user, callback) {
        console.log("here", user);
        const sql = `select username, gmail 
                     FROM users 
                     WHERE username = ? or gmail = ?`;
        connect.query(
            sql,
            [user.username, user.gmail],
            (err, result) => {
                if (err) {
                    console.log("1")
                    return callback(err);
                }
                if (isEmpty(result)) {
                    console.log("2")
                    return callback(null, { isUserExist: false });
                }
                if (result.length === 2) {
                    console.log("3")
                    return callback(new Error("USERNAME_GMAIL_UNIQUE"));
                } else if (result.length === 1) {
                    console.log("4")
                    if (result.some(item => item.username === user.username && item.gmail === user.gmail)) {
                        return callback(new Error("USERNAME_GMAIL_UNIQUE"));
                    }

                    if (result.some(item => item.username === user.username)) {
                        return callback(new Error("USERNAME_UNIQUE"));
                    }

                    if (result.some(item => item.gmail === user.gmail)) {
                        return callback(new Error("GMAIL_UNIQUE"));
                    }
                }
            }
        )
    }


    // List by roles
    static selectListUserByRole(roles, callback) {
        const sql = `SELECT * 
                     FROM users 
                     WHERE roles = ?`;
        connect.query(
            sql,
            roles,
            (err, result) => {
                if (err) {
                    return callback(err);
                }
                return callback(null, result);
            }
        )
    }


    static checkIslocked(userId, callback) {
        const sql = `SELECT 1 
                FROM users
                WHERE userId = ? AND isblocked = 0`;
        connect.query(
            sql,
            userId,
            (err, result) => {
                if (err) {
                    return callback(err);
                }
                if (result.length === 0) {
                    return callback(new Error('ACCOUNT_HAS_BLOCKED'));
                }
                return callback(null, { isBlocked: false });
            }
        )
    }

    static checkRole({ data, roles }, callback) {
        let roleValues = "";
        roles.forEach((value, index, array) => {
            roleValues += `"${value}"`;
            (index < array.length - 1) ? roleValues += ',' : '';
        });

        let sql = `SELECT 1 
                FROM users
                WHERE userId = ? AND roles IN `;
        sql += '(' + roleValues + ')';

        connect.query(
            sql,
            [data.userId],
            (err, result) => {
                console.log(result);
                if (err) {
                    return callback(err);
                }
                if (result.length === 0) {
                    return callback(new Error('FORBIDDEN'));
                }
                return callback(null, { hasRoles: true });
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