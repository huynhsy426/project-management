const Joi = require('joi');
const MyValidator = require('./validator');

const schemas = {
    createUser: {
        body: Joi.object().keys(
            {
                username: Joi.string()
                    .regex(/^[^0-9 ]*$/)
                    .trim()
                    .min(3)
                    .max(50)
                    .messages({
                        "string.min": "must more than 3 characters.",
                        "string.max": "must less than 50 characters.",
                        "string.pattern.base": "username must not contain numbers."
                    })
                    .required(),
                age: Joi.number()
                    .trim()
                    .integer()
                    .min(18)
                    .max(100)
                    .messages({
                        "number.max": "age is not a number."
                    })
                    .required(),
                userPassword: Joi.string()
                    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{3,20}$/)
                    .messages({
                        "string.pattern.base": "password must At least one digit, one lowercase letter, one uppercase letter, one special character and between 3 and 20 characters."
                    })
                    .required(),
                email: Joi.string()
                    .email()
                    .messages({
                        "string.email": "Invalid email address."
                    })
                    .required(),
                exp: Joi.number()
                    .integer()
                    .min(0)
                    .max(50)
                    .messages({
                        "number.max": "exp is not a number."
                    })
                    .required()
            }
        )
    }
}

class UserValidator extends MyValidator {
    validateCreateUser(req, res, next) {
        try {
            super.handleValidationError(req, schemas.createUser);
            return next();
        } catch (err) {
            return next(err);
        }
    }
}

module.exports = new UserValidator();