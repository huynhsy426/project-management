const Joi = require('joi');
const MyValidator = require('./index');

const bodySchema = Joi.object().keys({
    members: Joi.array().items(
        Joi.object().keys(
            {
                memberId: Joi.string()
                    .regex(/^[0-9a-fA-F]{24}$/)
                    .required(),
                position: Joi.string()
                    .regex(/^[a-zA-Z0-9_ ]{3,50}$/)
                    .required()
            }
        ).required()
    ).required()
})

class MemberValidator extends MyValidator {
    validateAddMember(req, res, next) {
        try {
            return this.handleValidationError(req.body);
        } catch (e) {
            return next(e);
        }
    }

}

module.exports = new MemberValidator({ body: bodySchema });