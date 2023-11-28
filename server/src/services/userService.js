const userModel = require('../models/userModel');

const { ErrorCodes } = require("../constants/errorConstant");

// Check user login
const checkUserLogin = async (username, userPassword) => {
    const result = await userModel.findOne(
        { $and: [{ username: username }, { userPassword: userPassword }] },
        { isBlocked: 1 }
    ).lean();

    if (!result) {
        throw new Error(ErrorCodes.WRONG_ACCOUNT);
    }
    if (result.isBlocked) {
        throw new Error(ErrorCodes.USER_HAS_BLOCKED);
    }
    return result;
}


// Create a new user
const createUser = async (user) => {
    const result = await userModel.insertMany(user);
    return result;
};


// Check user_name and email are exists
const isUserNameAndGmailExist = async (user) => {
    const result = await userModel.findOne(
        { $or: [{ username: user.username }, { email: user.email }] },
        { username: 1, email: 1, _id: 0 }
    ).lean();

    if (result) {
        throw (new Error(ErrorCodes.USERNAME_GMAIL_UNIQUE));
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


    getUser: (userId) => {
        return getUser(userId);
    },


    createUser: async (user) => {
        await isUserNameAndGmailExist(user);
        const result = await createUser(user);
        return result[0];
    }
}


