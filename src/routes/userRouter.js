const express = require('express');
const router = express.Router();
const {
    loginByUser,
    logOutUser,
    createUser
} = require('../controller/user-controller')


router.post('/login', loginByUser)

router.get('/logout', logOutUser)

router.post('/register', createUser)


module.exports = router