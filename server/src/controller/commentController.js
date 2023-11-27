const commentService = require('../services/commentService');

const { StatusCodes } = require('http-status-codes');


module.exports = {
    create: async (req, res, next) => {
        try {
            const user = req.user;
            const { content, taskId } = req.body;

            await commentService.create({ user, taskId, content });
            res.status(StatusCodes.OK).json();
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
    }
}