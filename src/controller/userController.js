const {
    loginByUserService,
    createUserService
} = require('../services/userService')

const { StatusCodes } = require('http-status-codes');

const UserModel = require('../models/userModel');

const JwtService = require('../services/JWTService')

// list Project
const listUsers = (req, res) => {
    const authorization = req.headers['authorization'] || '';

    const token = authorization.split('Bearer ')[1];
    console.log(token);
    const user = JwtService.decode(token);
    console.log(user, "askdjhkj");
    console.log(user.username)
    if (user && user.roles === "Admin") {

    } else if (user && user.roles !== "Admin") {

    }



    res.json({
        err: "asjhasjdhbjhb"
    })
};


// login
const loginByUser = (req, res, next) => {
    const { username, userPassword } = req.body;
    loginByUserService(
        { username, userPassword },
        function (err, { hasLogin, isBlocked, result }) {
            if (err) {
                next(err);
            }
            if (hasLogin) {
                const user = {
                    userId: result[0].userId,
                    username: result[0].username,
                    roles: result[0].roles,
                    gmail: result[0].gmail,
                    exps: result[0].exp,
                    isBlocked: result[0].isBlocked
                }

                if (!isBlocked) {
                    const token = JwtService.createJWT(user)
                    return res.status(StatusCodes.OK).json({
                        loginMessage: "Login successful",
                        accessToken: token
                    })
                }
                next(new Error("BLOCK_USER"))

            } else {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    aaa: "Wrong account"
                })
            }
        }
    )
};



// create Project
// Controller 
// Check user da ton tai chua
// Tao user -> 
const createUser = (req, res, next) => {
    const user = {
        username: req.body.username,
        age: req.body.age,
        roles: 'User',
        userPassword: req.body.userPassword,
        gmail: req.body.gmail,
        exp: req.body.exp,
        isBlocked: 0
    }


    UserModel.isUserNameAndGmailExist(
        user,
        function (error, result) {
            if (error) {
                return next(error);
            }

            if (!result) {
                createUserService(
                    user,
                    function (err, isCreate) {
                        if (err) {
                            next(err);
                        }
                        if (isCreate) {
                            return res.status(StatusCodes.OK).json({
                                registerMessage: "Register successfully"
                            })
                        }
                    }
                )
            }
        });


    createUserService(
        user,
        function (err, result) {
            if (err) {
                next(err);
            }
            if (result) {
                return res.status(StatusCodes.OK).json({
                    registerMessage: "Register successfully"
                })
            }
        }
    )

};


// Logout
const logOutUser = (req, res) => {
    console.log(req);
    // req.session.destroy();
    return res.status(200).json({
        loginMessage: "Logout successful"
    })
};


// Search Project
const searchUser = (req, res) => {

};


// delete project
const deleteById = (req, res) => {

};


// Update project
const updateByID = (req, res) => {

};


module.exports = {
    listUsers,
    createUser,
    searchUser,
    deleteById,
    updateByID,
    loginByUser,
    logOutUser
}