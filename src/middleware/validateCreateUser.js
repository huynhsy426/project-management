const Joi = require('joi');
const validator = require('express-joi-validation').createValidator({});


const bodySchema = Joi.object().keys(
    {
        username: Joi.string()
            .regex(/^[a-zA-Z ]{3,50}$/)
            .required(),
        age: Joi.number()
            .max(100)
            .required(),
        userPassword: Joi.string()
            .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{3,20}$/)
            .required(),
        gmail: Joi.string()
            .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
            .required(),
        exp: Joi.number()
            .max(50)
            .required()
    }
)


module.exports = {
    body: (req, res, next) => {
        const { error, value } = bodySchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errorMessages = error.details.map(detail => detail.message);
            return next(
                {
                    error: new Error("INVALID_DEPT_INPUT_BY_CLIENT"),
                    args: errorMessages,
                    value
                }
            )
        }
        return next();
    },

    params: (req, res, next) => {
        const { error, value } = paramSchema.validate(req.params, { abortEarly: false });
        if (error) {
            const errorMessages = error.details.map(detail => detail.message);
            return next(
                {
                    error: new Error("INVALID_DEPT_INPUT_BY_CLIENT"),
                    args: errorMessages,
                    value
                }
            )
        }
        return next();
    }
}