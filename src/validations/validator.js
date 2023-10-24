module.exports = class MyValidator {
    handleValidationError(req, schemas) {
        let errorMessages = [];
        for (const key in schemas) {
            const { error } = schemas[key].validate(req[key], { abortEarly: false });
            if (error) {
                for (let index = 0; index < error.details.length; index++) {
                    const element = error.details[index];
                    errorMessages.push(element.message);
                }
            }
        }

        if (errorMessages.length > 0) {
            throw {
                error: new Error("INVALID_INPUT_BY_CLIENT"),
                args: errorMessages,
            };
        }
        return;
    }
}
