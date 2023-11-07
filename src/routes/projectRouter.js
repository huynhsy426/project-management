const express = require('express');
const router = express.Router();

const projectController = require('../controller/projectController');
const projectValidator = require('../validations/projectValidator')
const JWTMiddleware = require('../middleware/JWTMiddleware');

const { UserRoles } = require('../constants/usersConstant');

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
        JWTMiddleware.verify([UserRoles.ADMIN])
    ],
    projectController.create
);


module.exports = router