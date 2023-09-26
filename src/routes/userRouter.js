const express = require('express');
const router = express.Router();

const {
    loginByUser,
    logOutUser,
    createUser,
    listUsers
} = require('../controller/userController');

const { validateUser } = require('../middleware/validateCreateUser');

const JWTMiddleware = require('../middleware/JWTMiddleware');


// Login by user
router.post('/login', loginByUser)


// logout
router.get('/logout', logOutUser)


// Register user
router.post('/register', [validateUser], createUser)


// List all users
router.get('/listUsers', [JWTMiddleware.verify], listUsers)


module.exports = router