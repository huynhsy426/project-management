const Joi = require('joi');
const validator = require('express-joi-validation').createValidator({});

const bodySchema = Joi.object().keys(
    {
        memberId: Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .required()
    }
)


const paramSchema = Joi.object().keys(
    {
        deptId: Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/)
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
        console.log({ a: req.params })
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