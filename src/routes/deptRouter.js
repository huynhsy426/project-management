const express = require('express');
const router = express.Router();

const deptController = require('../controller/deptController');

const validateCreateDept = require('../middleware/validateCreateDept');

const JWTMiddleware = require('../middleware/JWTMiddleware');


// getDeptPage
router.get("/list", [JWTMiddleware.verify([])], deptController.listDeptsByRoles)

// Create Dept
router.route("/admin/create")
    .post([validateCreateDept.validateDept, JWTMiddleware.verify(["Admin"])], deptController.createDept)

// Search dept by dept_name
router.get("/search/name/:deptName", deptController.searchDept)

// Delete dept by Id
// router.delete("/:id/delete", deleteById)

// Update dept by Id
router.put("/admin/:deptId/update", [validateCreateDept.validateDept, JWTMiddleware.verify(["Admin"])], deptController.updateById)


module.exports = router