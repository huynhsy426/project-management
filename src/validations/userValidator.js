const Joi = require('joi');
const MyValidator = require('./index');


const bodySchema = Joi.object().keys(
    {
        username: Joi.string()
            .regex(/^[a-zA-Z ]{3,50}$/)
            .required(),
        age: Joi.number()
            .max(100)
            .required(),
        userPassword: Joi.string()
            .alphaNumber()
            .maxLength
            .minLength()
            .required(),
        gmail: Joi.string()
            .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
            .required(),
        exp: Joi.number()
            .max(50)
            .required()
    }
)


class UserValidator extends MyValidator {
    validateCreateUser(req, res, next) {
        try {
            return this.handleValidationError(req.body);
        } catch (e) {
            return next(e);
        }
    }
}
module.exports = new UserValidator({
    body: bodySchema
});