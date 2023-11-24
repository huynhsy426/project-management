const express = require('express');
const router = express.Router();

const userController = require('../controller/userController');
const UserValidator = require('../validations/userValidator');
const JWTMiddleware = require('../middleware/JWTMiddleware');


// Login by user
router.post('/login', userController.loginByUser)


// logout
router.get('/logout', userController.logOutUser)


// Register user
router.post(
    '/register',
    [UserValidator.validateCreateUser],
    userController.createUser
)


// List all users test
router.get(
    '/',
    [JWTMiddleware.verify([])],
    userController.getUser
)


module.exports = router