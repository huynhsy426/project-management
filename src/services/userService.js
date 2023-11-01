const userModel = require('../models/userModel');


// Check user login
const checkUserLogin = async (username, userPassword) => {
    try {
        const result = await userModel.findOne(
            { $and: [{ username: username }, { userPassword: userPassword }] },
            { isBlocked: 1 }
        )
        if (result.length === 0) {
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
const createUser = async (user) => {
    try {
        await userModel.insertMany(user);
        return;
    } catch (error) {
        throw error;
    }
};


// Check user_name and gmail are exists
const isUserNameAndGmailExist = async (user) => {
    try {
        const result = await userModel.find(
            { $or: [{ username: user.username }, { gmail: user.gmail }] },
            { username: 1, gmail: 1, _id: 0 }
        )

        if (result.length === 0) {
            return;
        }

        if (result.length === 2) {
            throw (new Error("USERNAME_GMAIL_UNIQUE"));
        } else if (result.length === 1) {
            if (result.some(item => item.username === user.username && item.gmail === user.gmail)) {
                throw (new Error("USERNAME_GMAIL_UNIQUE"));
            }

            if (result.some(item => item.username === user.username)) {
                throw (new Error("USERNAME_UNIQUE"));
            }

            if (result.some(item => item.gmail === user.gmail)) {
                throw (new Error("GMAIL_UNIQUE"));
            }
        }
    } catch (err) {
        throw err;
    }
};


const getUser = async (userId) => {
    try {
        const result = await userModel.findById(
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




module.exports = {
    loginByUser: (username, userPassword) => {
        return checkUserLogin(username, userPassword)
    },


    list: (userId) => {
        return getUser(userId);
    },


    createUser: async (user) => {
        await isUserNameAndGmailExist(user);
        return createUser(user);
    }
}


