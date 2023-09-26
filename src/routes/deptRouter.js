const express = require('express');
const router = express.Router();
const {
    listDepts,
    createDept,
    searchDept,
    deleteById,
    updateById
} = require('../controller/deptController')


// getDeptPage
router.get("/deptList", listDepts)

// Create Dept
router.post("/createDept", createDept)

// Search dept by dept_name
router.get("/searchDept", searchDept)

// Delete dept by Id
router.delete("/deleteDept/:dept_id", deleteById)

// Update dept by Id
router.put("/updateDept", updateById)




module.exports = router