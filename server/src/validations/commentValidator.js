const Joi = require('joi');
const MyValidator = require('./validator');

const schemas = {
    create: {
        body: Joi.object().keys(
            {
                content: Joi.string()
                    .trim()
                    .max(5000)
                    .required(),
                taskId: Joi.string()
                    .trim()
                    .hex()
                    .length(24)
                    .required()
            }
        )
    },

    getCommentsByTaskId: {
        params: Joi.object().keys(
            {
                taskId: Joi.string()
                    .trim()
                    .hex()
                    .length(24)
                    .required()
            }
        )
    },

    getCommentsByCommentId: {
        params: Joi.object().keys(
            {
                commentId: Joi.string()
                    .trim()
                    .hex()
                    .length(24)
                    .required()
            }
        )
    }
}

class CommentValidator extends MyValidator {
    async validateCreate(req, res, next) {
        try {
            super.handleValidationError(req, schemas.create);
            return next();
        } catch (error) {
            return next(error);
        }
    }

    async validateGetComment(req, res, next) {
        try {
            super.handleValidationError(req, schemas.getCommentsByTaskId);
            return next();
        } catch (error) {
            return next(error);
        }
    };

    async validateGetCommentById(req, res, next) {
        try {
            super.handleValidationError(req, schemas.getCommentsByCommentId);
            return next();
        } catch (error) {
            return next(error);
        }
    }
}

module.exports = new CommentValidator();