const express = require('express');
const router = express.Router();

const MemberController = require('../controller/memberController');
const memberValidator = require('../validations/memberValidator');
const validateDeleteMember = require('../middleware/validateDeleteMember');
const JWTMiddleware = require('../middleware/JWTMiddleware');


// Get user for dept
router.get("/list/:deptId", [JWTMiddleware.verify([])], MemberController.listMembersToJoin)

// Add user for dept
router.post("/:deptId/add", [memberValidator.validateAddMember, JWTMiddleware.verify(["Admin"])], MemberController.addMembers)

router.delete(
    "/:deptId/delete",
    [
        validateDeleteMember.params,
        validateDeleteMember.body,
        JWTMiddleware.verify(["Admin"])
    ],
    MemberController.deleteMember
)

module.exports = router;