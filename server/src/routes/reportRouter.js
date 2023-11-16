const express = require('express');
const router = express.Router();

const reportController = require('../controller/reportController');
const JWTMiddleware = require('../middleware/JWTMiddleware');

router.get('/user',
    [
        JWTMiddleware.verify([])
    ],
    reportController.reportUser)


module.exports = router;