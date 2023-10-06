const UserService = require('../services/userService')

const { StatusCodes } = require('http-status-codes');

const UserModel = require('../models/userModel');

const JwtService = require('../services/JWTService')

class UserController {

    constructor() { }

    // List users
    listUsers = (req, res) => { };


    // create Project
    // Controller 
    // Check user da ton tai chua
    // Tao user -> 
    createUser = (req, res, next) => {
        const user = {
            username: req.body.username,
            age: req.body.age,
            roles: 'User',
            userPassword: req.body.userPassword,
            gmail: req.body.gmail,
            exp: req.body.exp,
            isBlocked: 0
        }

        UserModel.isUserNameAndGmailExist(user)
            .then(() => {
                return UserService.createUser(user)
            })
            .then(() => {
                return res.status(StatusCodes.OK).json({
                    registerMessage: "Register successfully"
                })
            })
            .catch(err => {
                return next(err);
            });
    };


    // Search Project
    searchUser = (req, res) => {

    };


    // delete user by Id
    deleteById = (req, res) => {

    };


    // update user by Id
    updateByID = (req, res) => {

    };


    // login
    loginByUser = (req, res, next) => {
        const { username, userPassword } = req.body;
        UserService.loginByUser(username, userPassword)
            .then(({ isBlocked, result }) => {
                console.log(isBlocked, result);
                if (!result) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        aaa: "Wrong account"
                    })
                }

                const user = {
                    userId: result[0].userId
                }

                if (!isBlocked) {
                    const token = JwtService.createJWT(user)
                    return res.status(StatusCodes.OK).json({
                        loginMessage: "Login successful",
                        accessToken: token
                    })
                }
                return next(new Error("BLOCK_USER"))
            })
            .catch(err => {
                return next(err);
            });
    };


    // logout
    logOutUser = (req, res) => {
        console.log(req);
        // req.session.destroy();
        return res.status(StatusCodes.OK).json({
            loginMessage: "Logout successful"
        })
    };
}

module.exports = new UserController();