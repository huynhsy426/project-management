const Joi = require('joi');
const MyValidator = require('./validator');

const schemas = {
    createProject: {
        body: Joi.object().keys(
            {
                projectName: Joi.string()
                    .trim()
                    .regex(/^[a-zA-Z0-9_ -]{3,50}$/)
                    .messages({
                        "string.pattern.base": "Project name not valid"
                    })
                    .required(),
                deptId: Joi.string()
                    .trim()
                    .hex()
                    .length(24)
                    .required(),
                leaderId: Joi.string()
                    .trim()
                    .hex()
                    .length(24)
                    .required()
            }
        ),

        params: Joi.object().keys(
            {
                minExp: Joi.number()
                    .integer()
                    .max(50)
                    .messages({
                        "number.max": "minExp must be less than 50."
                    })
                    .required()
            }
        )
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
                    .allow(null)
            }
        )
    },

    getProject: {
        params: Joi.object().keys(
            {
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
    }
}


class ProjectValidator extends MyValidator {

    validateCreateProject(req, res, next) {
        try {
            super.handleValidationError(req, schemas.createProject)
            return next();
        } catch (err) {
            return next(err);
        }
    };


    handlePagination(req, res, next) {
        try {
            super.handleValidationError(req, schemas.pagination)
            return next();
        } catch (err) {
            return next(err);
        }
    };

    validateGetProject(req, res, next) {
        try {
            super.handleValidationError(req, schemas.getProject)
            return next();
        } catch (error) {
            return next(error);
        }
    }


}

module.exports = new ProjectValidator();