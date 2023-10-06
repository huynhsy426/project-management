const validateString = (name) => {
    const regex = /^[a-zA-Z0-9_ ]{3,50}$/;
    const valid = regex.test(name)
    return valid;
};


const validateNumber = (age) => {
    const regex = /^[0-9]{0,3}$/;
    const valid = regex.test(age);
    return valid;
};


const validateDeptId = (id) => {
    const regex = /^D[0-9]{2,}$/;
    const valid = regex.test(id);
    return valid;
};


module.exports = {
    validateProject: (req, res, next) => {
        const projectEntity = {
            projectId: req.body.projecId,
            projectName: req.body.projectName,
            deptId: req.body.deptId,
            insTm: req.body.insTm,
            updTm: req.body.updTm,
            version: req.body.version,
            leaderId: req.body.leaderId,
            minExp: req.body.minExp,
            completedAt: req.body.completedAt
        }

        const errMessage = []

        !validateString(projectEntity.projectName) && errMessage.push("projectName is valid");
        !validateDeptId(projectEntity.deptId) && errMessage.push("deptId must like 'D***   ");
        validateNumber


        if (errMessage.length === 0) {
            return next();
        }

        return next({
            error: new Error("INVALID_PROJECT_INPUT_BY_CLIENT"),
            args: errMessage
        });
    }
}