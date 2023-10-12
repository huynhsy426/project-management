const validateNumber = (age) => {
    const regex = /^[0-9]{0,3}$/;
    const valid = regex.test(age);
    return valid;
};


const validateString = (name) => {
    const regex = /^[a-zA-Z0-9_ ]{3,50}$/;
    const valid = regex.test(name)
    return valid;
};


const validateDeptId = (id) => {
    const regex = /^D[0-9]{2,}$/;
    const valid = regex.test(id);
    return valid;
};


module.exports = {
    validateDelete: (req, res, next) => {
        const { memberId } = req.body;
        const { deptId } = req.params;

        const errMessage = [];

        (!memberId) && errMessage.push("Must provide a memberId.");
        (!deptId) && errMessage.push("Must provide a dept id.");

        !validateNumber(memberId) && errMessage.push("memberId must be number.");
        !validateDeptId(deptId) && errMessage.push("deptId must like 'D***   .");

        if (errMessage.length === 0) {
            return next();
        }

        return next({
            error: new Error("INVALID_PROJECT_INPUT_BY_CLIENT"),
            args: errMessage
        });
    }
}