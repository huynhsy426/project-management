const express = require('express');
const router = express.Router();

const commentController = require('../controller/commentController');
const CommentValidator = require('../validations/commentValidator');
const JWTMiddleware = require('../middleware/JWTMiddleware');

const { UserRoles } = require('../constants/usersConstant');

router.post('/create',
    [
        // handleWebsocket,
        CommentValidator.validateCreate,
        JWTMiddleware.verify([])
    ],
    commentController.create
)

router.get("/:taskId/task",
    [
        // handleWebsocket,
        CommentValidator.validateGetComment,
        JWTMiddleware.verify([])
    ],
    commentController.getCommentByTaskId
)

router.get("/:commentId",
    [
        CommentValidator.validateGetCommentById,
        JWTMiddleware.verify([])
    ],
    commentController.getCommentById
)

module.exports = router;