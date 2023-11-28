const express = require('express');
const router = express.Router();

const commentController = require('../controller/commentController');
const CommentValidator = require('../validations/commentValidator');
const JWTMiddleware = require('../middleware/JWTMiddleware');

const { UserRoles } = require('../constants/usersConstant');
const handleWebsocket = require('../utils/webSocket');

router.post('/create',
    [
        // handleWebsocket,
        CommentValidator.validateCreate,
        JWTMiddleware.verify([])
    ],
    commentController.create
)

router.get("/:taskId/list",
    [
        // handleWebsocket,
        CommentValidator.validateGetComment,
        JWTMiddleware.verify([])
    ],
    commentController.getCommentByTaskId
)

module.exports = router;