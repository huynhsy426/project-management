const Joi = require('joi');
const MyValidator = require('./validator');


const schemas = {
    createTask: {
        body: Joi.object().keys(
            {
                taskName: Joi.string()
                    .regex(/^[a-zA-Z0-9_ ]{3,100}$/)
                    .messages({
                        "string.pattern.base": "Task name not valid"
                    })
                    .required(),
                assignee: Joi.object().keys(
                    {
                        userId: Joi.string()
                            .hex()
                            .length(24)
                            .messages({
                                "string.pattern.base": "User not valid"
                            })
                    }
                ),
                content: Joi.string()
                    .min(3)
                    .max(999)
                    .required()
                    .messages({
                        "string.min": "must more than 2 characters.",
                        "string.max": "must less than 1000 characters."
                    }),
                attachments: Joi.any(),
                status: Joi.string()
                    .regex(/todo|doing|done|rejected/)
                    .required(),
                point: Joi.number()
                    .min(1)
                    .max(10)
                    .required()
                    .messages({
                        "string.min": "must more than 0 characters.",
                        "string.max": "must less than or equal 10 characters.",
                        "string.pattern.base": "Format must in todo|doing|done|rejected"
                    }),
            }
        )
    },


    assignTask: {
        params: Joi.object().keys(
            {
                taskId: Joi.string()
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
                    .hex()
                    .length(24)
                    .required()
                    .messages({
                        "string.pattern.base": "User not valid"
                    })
            }
        ),
        params: Joi.object().keys(
            {
                taskId: Joi.string()
                    .hex()
                    .length(24)
                    .required()
            }
        )
    }
}


class taskValidator extends MyValidator {

    validateCreateTask(req, res, next) {
        try {
            const data = req.body;

            let errorMessages = [];
            const { error } = schemas.createTask.body.validate(JSON.parse(req.body.data), { abortEarly: false });
            if (error) {
                for (let index = 0; index < error.details.length; index++) {
                    const element = error.details[index];
                    errorMessages.push(element.message);
                }
            }

            if (errorMessages.length > 0) {
                return next({
                    error: new Error("INVALID_INPUT_BY_CLIENT"),
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
}

module.exports = new taskValidator();