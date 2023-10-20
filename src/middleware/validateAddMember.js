const Joi = require('joi');
const validator = require('express-joi-validation').createValidator({});

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
    }
}