const mongoose = require('mongoose');

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

    static userSchema = new mongoose.Schema({
        username: {
            type: String,
            unique: true,
            required: true
        },
        age: {
            type: Number,
            required: true,
        },
        roles: {
            type: String,
            required: true,
        },
        userPassword: {
            type: String,
            required: true
        },
        gmail: {
            type: String,
            unique: true,
            required: true
        },
        exp: {
            type: Number,
            required: true
        },
        isBlocked: {
            type: Boolean,
            requierd: true
        }
    }, {
        versionKey: false // You should be aware of the outcome after set to false
    });

    static users = mongoose.model('users', this.userSchema);


    // Check user login
    static async checkUserLogin(username, userPassword) {
        try {
            const result = await this.users.findOne(
                { $and: [{ username: username }, { userPassword: userPassword }] },
                { isBlocked: 1 }
            )
            if (isEmpty(result)) {
                throw new Error("WRONG_ACCOUNT");
            } else {
                if (result.isBlocked === true) {
                    throw new Error("USER_HAS_BLOCKED");
                }
                return result;
            }
        } catch (error) {
            throw error;
        }
    }


    // Create a new user
    static async createUser(user) {
        try {
            await this.users.insertMany(user);
            return;
        } catch (error) {
            throw error;
        }
    };


    // Check user_name and gmail are exists
    static isUserNameAndGmailExist = async (user) => {
        try {
            const result = await this.users.find(
                { $or: [{ username: user.username }, { gmail: user.gmail }] },
                { username: 1, gmail: 1, _id: 0 }
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
        } catch (err) {
            throw err;
        }
    };


    static getUser = async (userId) => {
        try {
            const result = await this.users.findById(
                userId,
                {
                    roles: 1, username: 1,
                    age: 1, gmail: 1,
                    exp: 1, isBlocked: 1
                }
            ).limit(1);

            return result;
        } catch (err) {
            throw err;
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