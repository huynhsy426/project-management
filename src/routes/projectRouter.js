const express = require('express');
const router = express.Router();
const ProjectController = require('../controller/projectController');

// getListPage
router.get("/projectList", ProjectController.listProject)

// Create project
router.post("/createProject", ProjectController.createProject)

// Search project by project_id, project_name, difficulty, dept_id
router.get("/searchProject", ProjectController.searchProjects)

// Delete project by Id
router.delete("/deleteProject/:projectId", ProjectController.deleteById)

// Update project by Id
router.put("/updateProject", ProjectController.updateById)



module.exports = router