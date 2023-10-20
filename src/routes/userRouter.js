const express = require('express');
const router = express.Router();

const userController = require('../controller/userController');
const validateCreateUser = require('../middleware/validateCreateUser');
const JWTMiddleware = require('../middleware/JWTMiddleware');


// Login by user
router.post('/login', userController.loginByUser)


// logout
router.get('/logout', userController.logOutUser)


// Register user
router.post(
    '/register',
    [validateCreateUser.body],
    userController.createUser
)


// List all users test
router.get(
    '/list',
    [JWTMiddleware.verify([])],
    userController.listUsers
)


module.exports = router