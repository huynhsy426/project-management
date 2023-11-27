const Joi = require('joi');
const MyValidator = require('./validator');
const { ErrorCodes } = require('../constants/errorConstant');
const fse = require('fs-extra');


const schemas = {
    createTask: {
        body: Joi.object().keys(
            {
                taskName: Joi.string()
                    .trim()
                    .regex(/^[a-zA-Z0-9_ ]{3,100}$/)
                    .messages({
                        "string.pattern.base": "Task name not valid"
                    })
                    .required(),
                assignee: Joi.string()
                    .trim()
                    .hex()
                    .length(24)
                    .allow(null, '')
                    .messages({
                        "string.pattern.base": "User not valid"
                    }),
                content: Joi.string()
                    .trim()
                    .min(3)
                    .max(999)
                    .required()
                    .messages({
                        "string.min": "content must more than 2 characters.",
                        "string.max": "content must less than 1000 characters."
                    }),
                point: Joi.number()
                    .integer()
                    .min(1)
                    .max(10)
                    .required()
                    .messages({
                        "string.min": "point must more than 0 characters.",
                        "string.max": "point must less than or equal 10 characters.",
                        "string.pattern.base": "Format must in todo|doing|done|rejected"
                    }),
                deadlineAt: Joi.date()
                    .greater(Date.now() - 3000)
                    .required(),
                projectId: Joi.string()
                    .trim()
                    .hex()
                    .length(24)
                    .required()
                    .messages({
                        "string.pattern.base": "Project not valid"
                    })
            }
        )
    },


    assignTask: {
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

    changeAssignee: {
        body: Joi.object().keys(
            {
                userId: Joi.string()
                    .trim()
                    .hex()
                    .length(24)
                    .required()
            }
        ),
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


    updateTask: {
        body: Joi.object().keys({
            taskName: Joi.string()
                .trim()
                .regex(/^[a-zA-Z0-9_ ]{3,100}$/)
                .allow(null)
                .messages({
                    "string.pattern.base": "Task name not valid"
                }),
            content: Joi.string()
                .trim()
                .min(3)
                .max(999)
                .required()
                .messages({
                    "string.min": "must more than 2 characters.",
                    "string.max": "must less than 1000 characters."
                }),
            attachments: Joi.any()
                .meta({ swaggerType: 'file' })
                .optional(),
            point: Joi.number()
                .integer()
                .min(1)
                .max(10)
                .allow(null)
                .messages({
                    "string.min": "must more than 0 characters.",
                    "string.max": "must less than or equal 10 characters.",
                    "string.pattern.base": "Format must in todo|doing|done|rejected"
                }),
            status: Joi.string()
                .valid("todo", "doing", "done", "rejected")
                .allow(null),
            deadlineAt: Joi.date()
                .greater(Date.now() - 3000)
                .allow(null),
            oldAttachments: Joi.any()


        }),

        params: Joi.object().keys({
            taskId: Joi.string()
                .trim()
                .hex()
                .length(24)
                .required()
        })
    },

    pagination: {
        query: Joi.object().keys(
            {
                page: Joi.number()
                    .integer()
                    .min(0)
                    .allow(null),
                ITEMS_PER_PAGE: Joi.number()
                    .integer()
                    .min(0)
                    .allow(null),
                taskType: Joi.string()
                    .valid("a", "na")
                    .allow(null)
            }
        )
    },


    getTask: {
        params: Joi.object().keys({
            taskId: Joi.string()
                .trim()
                .hex()
                .length(24)
                .required()
        })
    }
}


class TaskValidator extends MyValidator {

    async validateCreateTask(req, res, next) {
        try {
            const attachments = req.files;
            const data = req.body;

            let errorMessages = [];
            const { error } = schemas.createTask.body.validate(data, { abortEarly: false });
            if (error) {
                for (let index = 0; index < error.details.length; index++) {
                    const element = error.details[index];
                    errorMessages.push(element.message);
                }
            }

            if (errorMessages.length > 0) {
                for (const item of attachments) {
                    const file = item.path;
                    await fse.remove(file);
                }
                return next({
                    error: new Error(ErrorCodes.INVALID_INPUT_BY_CLIENT),
                    args: errorMessages,
                });
            }
            return next();
        } catch (error) {
            return next(error);
        }
    };


    validateAssignTask(req, res, next) {
        try {
            super.handleValidationError(req, schemas.assignTask);
            return next();
        } catch (error) {
            return next(error);
        }
    };


    validateChangeAssignee(req, res, next) {
        try {
            super.handleValidationError(req, schemas.changeAssignee);
            return next();
        } catch (error) {
            return next(error);
        };
    };


    async validateUpdateTask(req, res, next) {
        try {
            const attachments = req.files;
            const dataBody = req.body;
            const dataParams = req.params;

            let errorMessages = [];
            const { error } = schemas.updateTask.body.validate(dataBody, { abortEarly: false });
            if (error) {
                for (let index = 0; index < error.details.length; index++) {
                    const element = error.details[index];
                    errorMessages.push(element.message);
                }
            }

            const { error1 } = schemas.updateTask.params.validate(dataParams, { abortEarly: false });
            if (error1) {
                for (let index = 0; index < error.details.length; index++) {
                    const element = error.details[index];
                    errorMessages.push(element.message);
                }
            }

            if (errorMessages.length > 0) {
                for (const item of attachments) {
                    const file = item.path;
                    await fse.remove(file);
                }
                return next({
                    error: new Error(ErrorCodes.INVALID_INPUT_BY_CLIENT),
                    args: errorMessages,
                });
            }
            return next();
        } catch (error) {
            return next(error);
        };
    };


    handlePagination(req, res, next) {
        try {
            super.handleValidationError(req, schemas.pagination);
            return next();
        } catch (err) {
            return next(err);
        }
    };

    validateGetTask(req, res, next) {
        try {
            super.handleValidationError(req, schemas.getTask);
            return next();
        } catch (error) {
            return next(error);
        }
    }
}

module.exports = new TaskValidator();