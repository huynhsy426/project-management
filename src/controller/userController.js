const UserService = require('../services/userService')

const { StatusCodes } = require('http-status-codes');

const UserModel = require('../models/userModel');

const JwtService = require('../services/JWTService')

class UserController {

    constructor() { }

    // List users
    listUsers = (req, res) => {
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

        UserModel.isUserNameAndGmailExist(
            user,
            function (error, isUserExist) {
                if (error) {
                    return next(error);
                }
                console.log('isUserExist', isUserExist)
                if (!isUserExist.isUserExist) {
                    UserService.createUserService(
                        user,
                        function (err, isCreate) {
                            if (err) {
                                return next(err);
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
        UserService.loginByUserService(
            { username, userPassword },
            function (err, { isBlocked, result }) {
                if (err) {
                    return next(err);
                }
                if (result.length !== 0) {
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
                    return next(new Error("BLOCK_USER"))

                } else {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        aaa: "Wrong account"
                    })
                }
            }
        )
    };


    // logout
    logOutUser = (req, res) => {
        console.log(req);
        // req.session.destroy();
        return res.status(200).json({
            loginMessage: "Logout successful"
        })
    };
}

module.exports = new UserController();