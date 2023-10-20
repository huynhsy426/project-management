const UserService = require('../services/userService')

const { StatusCodes } = require('http-status-codes');

const UserModel = require('../models/userModel');

const JwtService = require('../services/JWTService')

class UserController {

    constructor() { }

    // List users test
    listUsers = async (req, res) => {
        try {
            const user = req.user;
            console.log({ user });
            console.log("here")
            const result = await UserModel.getUser(user.userId);
            console.log({ result });
            return res.json({ result })
        } catch (err) {
            console.log(err)
        };
    };


    // create Project
    // Controller 
    // Check user da ton tai chua
    // Tao user -> 
    createUser = async (req, res, next) => {
        const user = {
            username: req.body.username,
            age: req.body.age,
            roles: 'User',
            userPassword: req.body.userPassword,
            gmail: req.body.gmail,
            exp: req.body.exp,
            isBlocked: false
        }
        try {
            await UserModel.isUserNameAndGmailExist(user);
            await UserService.createUser(user);
            return res.status(StatusCodes.OK).json();
        } catch (error) {
            return next(error);
        }
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
    loginByUser = async (req, res, next) => {
        const { username, userPassword } = req.body;
        console.log({ username, userPassword })
        try {
            const result = await UserService.loginByUser(username, userPassword);

            const user = {
                userId: result._id
            }
            const token = JwtService.createJWT(user)

            return res.status(StatusCodes.OK).json({
                loginMessage: "Login successful",
                accessToken: token
            });
        } catch (error) {
            return next(error);
        }
    };


    // logout
    logOutUser = (req, res) => {
        // req.session.destroy();
        return res.status(StatusCodes.OK).json({
            loginMessage: "Logout successful"
        })
    };


    loginTest = async (req, res, next) => {
        const user = {
            username: req.body.username,
            age: req.body.age,
            roles: 'User',
            userPassword: req.body.userPassword,
            gmail: req.body.gmail,
            exp: req.body.exp,
            isBlocked: false
        }

        try {
            await UserModel.isUserNameAndGmailExist(user);
            await UserModel.create(user);
        } catch (err) {
            return next(err)
        };

    }
}

module.exports = new UserController();