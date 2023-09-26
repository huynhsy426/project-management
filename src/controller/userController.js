const {
    loginByUserService,
    createUserService
} = require('../services/userService')

const { StatusCodes } = require('http-status-codes');


const JwtService = require('../services/JWTService')

// list Project
const listUsers = (req, res) => {
    const authorization = req.headers['authorization'] || '';

    const token = authorization.split('Bearer ')[1];
    console.log(JwtService.decode(token), "askdjhkj");


    res.json({
        err: "asjhasjdhbjhb"
    })
};


// login
const loginByUser = (req, res, next) => {
    const { username, userPassword } = req.body;
    loginByUserService(
        username,
        userPassword,
        function (err, isLogin, result) {
            if (err) {
                next(err);
            }
            if (isLogin) {
                console.log(result[0])
                const token = JwtService.createJWT(result[0])
                return res.status(StatusCodes.OK).json({
                    loginMessage: "Login successful",
                    accessToken: token
                })
            } else {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    aaa: "Wrong account"
                })
            }
        }
    )
};



// create Project
const createUser = (req, res, next) => {
    const user = {
        username: req.body.username,
        age: req.body.age,
        roles: 4,
        userPassword: req.body.userPassword,
        gmail: req.body.gmail,
        isBlocked: false
    }


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
    req.session.destroy();
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