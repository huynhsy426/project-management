const Joi = require('joi');
const MyValidator = require('./index');

const schemas = {
    creatProject: {
        body: Joi.object().keys(
            {
                projectName: Joi.string()
                    .regex(/^[a-zA-Z0-9_ -]{3,50}$/)
                    .required(),
                deptId: Joi.string()
                    .regex(/^[0-9a-fA-F]{24}$/)
                    .required(),
                leaderId: Joi.string()
                    .regex(/^[0-9a-fA-F]{24}$/)
                    .required()
            }
        ),
        params: Joi.object().keys(
            {
                minExp: Joi.number()
                    .max(999)
                    .required()
            }
        )
    },
    listProject: {
        query: Joi.object({
            page: Joi.number().max(1000).min(1).default(1),
            limit: Joi.number().max(10000).min(1).default(20),
        })
    }

}

class UserValidator extends MyValidator {
    validateCreateProject(req, res, next) {
        try {
            return this.handleValidationError(req, schemas.creatProject);
        } catch (e) {
            return next(e);
        }
    }
    validateListProject(req, res, next) {
        try {
            return this.handleValidationError(req, schemas.listProject);
        } catch (e) {
            return next(e);
        }
    }
}

module.exports = new UserValidator();