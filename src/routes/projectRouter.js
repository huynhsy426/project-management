const express = require('express');
const router = express.Router();
const {
    listProject,
    createProject,
    searchProjects,
    deleteById,
    updateById
} = require('../controller/projectController');

// getListPage
router.get("/projectList", listProject)

// Create project
router.post("/createProject", createProject)

// Search project by project_id, project_name, difficulty, dept_id
router.get("/searchProject", searchProjects)

// Delete project by Id
router.delete("/deleteProject/:project_id", deleteById)

// Update project by Id
router.put("/updateProject", updateById)



module.exports = router