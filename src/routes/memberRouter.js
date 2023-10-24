const express = require('express');
const router = express.Router();

const MemberController = require('../controller/memberController');
const MemberValidator = require("../validations/memberValidator");
const JWTMiddleware = require('../middleware/JWTMiddleware');


// Get user for dept
router.get("/list/:deptId", [JWTMiddleware.verify([])], MemberController.listMembersToJoin)

// Add user for dept
router.post("/:deptId/add", [MemberValidator.validateAddMember, JWTMiddleware.verify(["Admin"])], MemberController.addMembers)

router.delete(
    "/:deptId/delete",
    [
        MemberValidator.validateDeleteMember,
        JWTMiddleware.verify(["Admin"])
    ],
    MemberController.deleteMember
)

module.exports = router;