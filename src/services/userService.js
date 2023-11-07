const userModel = require('../models/userModel');


// Check user login
const checkUserLogin = async (username, userPassword) => {
    try {
        const result = await userModel.findOne(
            { $and: [{ username: username }, { userPassword: userPassword }] },
            { isBlocked: 1 }
        ).lean();

        if (result) {
            if (result.isBlocked === true) {
                throw new Error("USER_HAS_BLOCKED");
            }
            return result;
        }
        throw new Error("WRONG_ACCOUNT");
    } catch (error) {
        throw error;
    }
}


// Create a new user
const createUser = async (user) => {
    await userModel.insertMany(user);
    return;

};


// Check user_name and email are exists
const isUserNameAndGmailExist = async (user) => {
    const result = await userModel.findOne(
        { $or: [{ username: user.username }, { email: user.email }] },
        { username: 1, email: 1, _id: 0 }
    ).lean();

    if (result) {
        throw (new Error("USERNAME_GMAIL_UNIQUE"));
    }
    return;
};


const getUser = async (userId) => {
    const result = await userModel.findById(
        userId,
        {
            roles: 1, username: 1,
            age: 1, email: 1,
            exp: 1, isBlocked: 1
        }
    ).limit(1);

    return result;
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


