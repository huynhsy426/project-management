const express = require('express');
const router = express.Router();

const MemberController = require('../controller/memberController');
const MemberValidator = require("../validations/memberValidator");
const JWTMiddleware = require('../middleware/JWTMiddleware');

const { UserRoles } = require('../constants/usersConstant');

// Get user for dept
router.get("/list/:deptId", [JWTMiddleware.verify([])], MemberController.listMembersToJoin)

// Add user for dept
router.post("/admin/:deptId/add", [MemberValidator.validateAddMember, JWTMiddleware.verify([UserRoles.ADMIN])], MemberController.addMembers)

router.delete(
    "/:deptId/delete",
    [
        MemberValidator.validateDeleteMember,
        JWTMiddleware.verify([UserRoles.ADMIN])
    ],
    MemberController.deleteMember
)

module.exports = router;