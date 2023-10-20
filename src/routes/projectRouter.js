const express = require('express');
const router = express.Router();

const projectController = require('../controller/projectController');
const validateCreateProject = require("../middleware/validateCreateProject");
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
        validateCreateProject.params,
        validateCreateProject.body,
        JWTMiddleware.verify(["Admin"])
    ],
    projectController.create
);


router.get(
    '/lista',
    projectController.list
)


module.exports = router