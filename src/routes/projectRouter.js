const express = require('express');
const router = express.Router();
const ProjectController = require('../controller/projectController');


router.get('/list', ProjectController.listProject)


module.exports = router