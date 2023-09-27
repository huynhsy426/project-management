const validateDept = (req, res, next) => {
    const deptEntity = {
        deptId: req.body.deptId,
        deptName: req.body.deptName,
        authorId: req.body.authorId
    }

    const errMessage = []

    !validateDeptName(deptEntity.deptName) && errMessage.push("dept name is valid");
    !validateNumber(deptEntity.authorId) && errMessage.push("authorId is not a number");

    if (errMessage.length === 0) {
        return next();
    }

    return next({
        error: new Error("INVALID_DEPT_INPUT_BY_CLIENT"),
        args: errMessage
    });


}


const validateDeptName = (name) => {
    const regex = /^[a-zA-Z0=9_ ]{3,50}$/;
    const valid = regex.test(name)
    return valid;
};


const validateNumber = (age) => {
    const regex = /^[0-9]{0,3}$/;
    const valid = regex.test(age);
    return valid;
};

module.exports = {
    validateDept
}