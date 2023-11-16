const Joi = require('joi');
const MyValidator = require('./validator');

const schemas = {
    createDept: {
        body: Joi.object().keys(
            {
                deptName: Joi.string()
                    .trim()
                    .regex(/^[a-zA-Z0-9_ ]{3,50}$/)
                    .messages({
                        "string.pattern.base": "Dept name not valid"
                    })
                    .required(),
                members: Joi.array().items(
                    Joi.object().keys(
                        {
                            memberId: Joi.string()
                                .trim()
                                .hex()
                                .length(24)
                                .required(),
                            position: Joi.string()
                                .trim()
                                .alphanum()
                                .regex(/^[a-zA-Z0-9_ ]{3,50}$/)
                                .messages({
                                    "string.pattern.base": "position not valid"
                                })
                                .required()
                        }
                    )
                ).required()
            }
        )
    },

    updateDept: {
        body: Joi.object().keys(
            {
                deptName: Joi.string()
                    .trim()
                    .regex(/^[a-zA-Z0-9_ ]{3,50}$/)
                    .required()
            }
        ),
        params: Joi.object().keys(
            {
                deptId: Joi.string()
                    .trim()
                    .hex()
                    .length(24)
                    .required()
            }
        )
    }
}


class DeptValidator extends MyValidator {

    validateCreatDept(req, res, next) {
        try {
            super.handleValidationError(req, schemas.createDept)
            return next();
        } catch (error) {
            return next(error);
        }
    };

    validateUpdateDept(req, res, next) {
        try {
            super.handleValidationError(req, schemas.updateDept)
            return next();
        } catch (error) {
            return next(error);
        }
    }

}

module.exports = new DeptValidator();