const commentService = require('../services/commentService');

const { StatusCodes } = require('http-status-codes');


module.exports = {
    create: async (req, res, next) => {
        try {
            const user = req.user;
            const { content, taskId } = req.body;

            const result = await commentService.create({ user, taskId, content });
            res.status(StatusCodes.OK).json({ result });
        } catch (error) {
            return next(error);
        }
    },

    getCommentByTaskId: async (req, res, next) => {
        try {
            const taskId = req.params.taskId;
            const comments = await commentService.getCommentByTaskId(taskId);
            res.status(StatusCodes.OK).json({ comments });
        } catch (error) {
            return next(error);
        }
    },

    getCommentById: async (req, res, next) => {
        try {
            const commentId = req.params.commentId;
            const comment = await commentService.getCommentById(commentId);
            console.log({ comment });
            res.status(StatusCodes.OK).json({ comment });
        } catch (error) {
            return next(error);
        }
    }
}