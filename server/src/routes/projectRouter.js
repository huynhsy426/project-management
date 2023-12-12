const express = require('express');
const router = express.Router();

const projectController = require('../controller/projectController');
const projectValidator = require('../validations/projectValidator')
const JWTMiddleware = require('../middleware/JWTMiddleware');

const { UserRoles } = require('../constants/usersConstant');

router.get('/list',
    [
        projectValidator.handlePagination,
        JWTMiddleware.verify([])
    ],
    projectController.listProjectByRoles
);


router.get('/:projectId',
    [
        projectValidator.validateGetProject,
        JWTMiddleware.verify([])
    ],
    projectController.getProjectById
);


router.get('/:projectId/tasks',
    [
        projectValidator.validateGetProject,
        JWTMiddleware.verify([])
    ],
    projectController.getTasksByProjectId
)

router.post(
    '/create/:minExp/project',
    [
        projectValidator.validateCreateProject,
        JWTMiddleware.verify([UserRoles.ADMIN])
    ],
    projectController.create
);


router.get(
    '/:projectId/members',
    [
        projectValidator.validateListMembers,
        JWTMiddleware.verify([])
    ],
    projectController.getMemberOfProject
)


module.exports = router