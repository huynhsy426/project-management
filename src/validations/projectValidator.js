const Joi = require('joi');
const MyValidator = require('./validator');

const schemas = {
    createProject: {
        body: Joi.object().keys(
            {
                projectName: Joi.string()
                    .regex(/^[a-zA-Z0-9_ -]{3,50}$/)
                    .messages({
                        "string.pattern.base": "Project name not valid"
                    })
                    .required(),
                deptId: Joi.string()
                    .hex()
                    .length(24)
                    .required(),
                leaderId: Joi.string()
                    .hex()
                    .length(24)
                    .required()
            }
        ),

        params: Joi.object().keys(
            {
                minExp: Joi.number()
                    .max(50)
                    .messages({
                        "number.max": "minExp must be less than 50."
                    })
                    .required()
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


}

module.exports = new ProjectValidator();