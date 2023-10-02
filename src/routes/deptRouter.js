const express = require('express');
const router = express.Router();
const {
    listDeptsByRoles,
    createDeptView,
    createDept,
    searchDept,
    deleteById,
    updateById
} = require('../controller/deptController');

const { validateDept } = require('../middleware/validateCreateDept');

const JWTMiddleware = require('../middleware/JWTMiddleware');


// getDeptPage
router.get("/list", listDeptsByRoles)

// Create Dept
router.route("/createDept")
    .get([JWTMiddleware.verify, JWTMiddleware.hasRole], createDeptView)
    .post([JWTMiddleware.verify, JWTMiddleware.hasRole, validateDept], createDept)

// Search dept by dept_name
router.get("/searchDept", searchDept)

// Delete dept by Id
router.delete("/deleteDept/:dept_id", deleteById)

// Update dept by Id
router.put("/updateDept", [JWTMiddleware.verify, JWTMiddleware.hasRole], updateById)




module.exports = router