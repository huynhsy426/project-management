const express = require('express');
const router = express.Router();

const MemberController = require('../controller/memberController');
const validateAddMember = require('../middleware/validateAddMember');
const validateDeleteMember = require('../middleware/validateDeleteMember');
const JWTMiddleware = require('../middleware/JWTMiddleware');


// Get user for dept
router.get("/list/:deptId", [JWTMiddleware.verify([])], MemberController.listMembersToJoin)

// Add user for dept
router.post("/:deptId/add", [validateAddMember.validateMembers, JWTMiddleware.verify(["Admin"])], MemberController.addMembers)

router.delete("/:deptId/delete", [validateDeleteMember.validateDelete, JWTMiddleware.verify(["Admin"])], MemberController.deleteMember)

module.exports = router;