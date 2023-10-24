const express = require('express');
const router = express.Router();

const projectController = require('../controller/projectController');
const projectValidator = require('../validations/projectValidator')
const JWTMiddleware = require('../middleware/JWTMiddleware');

router.get('/list',
    [
        JWTMiddleware.verify([])
    ],
    projectController.listProjectByRoles
);

router.post(
    '/create/:minExp/project',
    [
        projectValidator.validateCreateProject,
        JWTMiddleware.verify(["Admin"])
    ],
    projectController.create
);


module.exports = router