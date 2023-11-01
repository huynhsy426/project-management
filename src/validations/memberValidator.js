const Joi = require('joi');
const MyValidator = require('./validator');


const schemas = {
    addMembers: {
        body: Joi.object().keys(
            {
                members: Joi.array().items(
                    Joi.object().keys(
                        {
                            memberId: Joi.string()
                                .hex()
                                .length(24)
                                .required(),
                            position: Joi.string()
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
        ),

        params: Joi.object().keys(
            {
                deptId: Joi.string()
                    .hex()
                    .length(24)
                    .required()
            }
        )

    },

    deleteMember: {
        body: Joi.object().keys(
            {
                memberId: Joi.string()
                    .hex()
                    .length(24)
                    .required()
            }
        ),

        params: Joi.object().keys(
            {
                deptId: Joi.string()
                    .hex()
                    .length(24)
                    .required()
            }
        )
    }

}


class MemberValidator extends MyValidator {

    validateAddMember(req, res, next) {
        try {
            super.handleValidationError(req, schemas.addMembers);
            return next();
        } catch (error) {
            return next(error);
        }
    };


    validateDeleteMember(req, res, next) {
        try {
            super.handleValidationError(req, schemas.deleteMember);
            return next();
        } catch (error) {
            return next(error);
        }
    };
}


module.exports = new MemberValidator();

