module.exports = class MyValidator {
    handleValidationError(req, schemas) {
        for (const key in schemas) {
            const { error, value } = schemas[key].validate(req[key], { abortEarly: false });
            if (error) {
                const errorMessages = error.details.map(detail => detail.message);
                throw {
                    // error: new Error("INVALID_DEPT_INPUT_BY_CLIENT"),
                    errors: errorMessages,
                    value
                };
            }
        }
    }
}