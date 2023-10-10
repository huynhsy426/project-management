const mySQLConnection = require('./connection')
const mysql = require('mysql2/promise');

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
    };


    // Check user login
    static async checkUserLogin(username, userPassword) {
        const connect = await mysql.createConnection(mySQLConnection);
        try {
            const sql = `SELECT * 
                         FROM users 
                         WHERE username = ? AND userPassword = ?`;

            const [result] = await connect.execute(
                sql,
                [username, userPassword]);
            console.log(result, "user dang nhap");
            if (isEmpty(result)) {
                return;
            } else {
                if (result[0].isBlocked === 1) {
                    // xoa hasLogin, only use result is enough
                    console.log("1")
                    return ({ isBlocked: true, result });
                }
                console.log("2")
                return ({ isBlocked: false, result });
            }
        } catch (error) {
            throw error;
        } finally {
            connect.end();
        }
    };


    // Create a new user
    static async createUser(user) {
        const connect = await mysql.createConnection(mySQLConnection);

        try {
            const sql = `INSERT INTO users (username, age, roles, userPassword, gmail, exp, isBlocked) 
                             VALUES (?, ?, ?, ?, ? , ?, ?)`;
            await connect.execute(
                sql,
                [user.username, user.age, user.roles, user.userPassword, user.gmail, user.exp, user.isBlocked]);
            return;
        } catch (error) {
            throw error;
        } finally {
            connect.end();
        }
    };


    // Check user_name and gmail are exists
    static async isUserNameAndGmailExist(user) {
        const connect = await mysql.createConnection(mySQLConnection);

        try {
            const sql = `select username, gmail 
                         FROM users 
                         WHERE username = ? or gmail = ?`;

            const [result] = await connect.execute(
                sql,
                [user.username, user.gmail]
            )
            if (isEmpty(result)) {
                console.log("2")
                return;
            }
            if (result.length === 2) {
                console.log("3")
                throw (new Error("USERNAME_GMAIL_UNIQUE"));
            } else if (result.length === 1) {
                console.log("4")
                if (result.some(item => item.username === user.username && item.gmail === user.gmail)) {
                    throw (new Error("USERNAME_GMAIL_UNIQUE"));
                }

                if (result.some(item => item.username === user.username)) {
                    console.log("5");
                    throw (new Error("USERNAME_UNIQUE"));
                }

                if (result.some(item => item.gmail === user.gmail)) {
                    console.log("6");
                    throw (new Error("GMAIL_UNIQUE"));
                }
            }
        } catch (error) {
            throw error;
        } finally {
            connect.end();
        }
    };


    static async getUser(userId) {
        const connect = await mysql.createConnection(mySQLConnection);

        try {
            const sql = `SELECT userId, roles, username, age, gmail, exp, isBlocked
                         FROM users
                         WHERE userId = ? LIMIT 1`;
            const [result] = await connect.execute(sql, [userId])
            return result;
        } catch (error) {
            throw error;
        } finally {
            connect.end();
        }
    };


};


function isEmpty(obj) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
};

module.exports = UserModel;