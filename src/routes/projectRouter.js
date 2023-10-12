const express = require('express');
const router = express.Router();

const projectController = require('../controller/projectController');
const validateCreateProject = require("../middleware/validateCreateProject");
const JWTMiddleware = require('../middleware/JWTMiddleware');

router.get('/list', [JWTMiddleware.verify()], projectController.listProjectByRoles);

router.post('/create/:minExp/project', [validateCreateProject.validateProject, JWTMiddleware.verify(["Admin"])], projectController.create);


module.exports = router