const UserService = require('../services/userService')
const JwtService = require('../services/JWTService')

const { StatusCodes } = require('http-status-codes');
const { UserRoles } = require('../constants/usersConstant');

module.exports = {
    getUser: async (req, res, next) => {
        try {
            const user = req.user;
            const result = await UserService.getUser(user.userId);
            return res.json({ result })
        } catch (err) {
            return next(err);
        };
    },


    // create Project
    // Controller 
    // Check user da ton tai chua
    // Tao user -> 
    createUser: async (req, res, next) => {
        const user = {
            username: req.body.username,
            age: req.body.age,
            roles: UserRoles.USER,
            userPassword: req.body.userPassword,
            email: req.body.email,
            exp: req.body.exp,
            isBlocked: false
        }
        try {
            const result = await UserService.createUser(user);
            console.log({ result })
            return res.status(StatusCodes.OK).json({ result });
        } catch (error) {
            return next(error);
        }
    },


    // Search Project
    searchUser: (req, res) => {

    },


    // delete user by Id
    deleteById: (req, res) => {

    },


    // update user by Id
    updateByID: (req, res) => {

    },


    // login
    loginByUser: async (req, res, next) => {
        const { username, userPassword } = req.body;
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
    },


    // logout
    logOutUser: (req, res) => {
        // req.session.destroy();
        return res.status(StatusCodes.OK).json({
            loginMessage: "Logout successful"
        })
    }
}