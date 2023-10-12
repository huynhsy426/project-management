const validateString = (name) => {
    const regex = /^[a-zA-Z0-9_ -]{3,50}$/;
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

const validateDate = (date) => {
    const regex = /^\d{4}\/\d{2}\/\d{2}$/;
    const valid = regex.test(date);
    return valid;
}

const checkDateBefore = (date) => {
    let currentdate = new Date();
    date = new Date(date);
    return date <= currentdate;
}

const checkDateAfter = (date) => {
    let currentdate = new Date();
    date = new Date(date);
    return date > currentdate;
}


module.exports = {
    validateProject: (req, res, next) => {
        const { minExp } = req.params;
        const projectEntity = {
            projectId: req.body.projecId,
            projectName: req.body.projectName,
            deptId: req.body.deptId,
            insTm: req.body.insTm,
            updTm: req.body.updTm,
            version: req.body.version,
            leaderId: req.body.leaderId,
            minExp,
            completedAt: req.body.completedAt
        }

        const errMessage = [];

        // Check not null
        (!projectEntity.projectName) && errMessage.push("Must provide a project name.");
        (!projectEntity.deptId) && errMessage.push("Must provide a dept id.");
        (!projectEntity.leaderId) && errMessage.push("Must provide a leader.");
        (!projectEntity.minExp) && errMessage.push("Must provide Minimum years of experiences.");

        // Check valid input
        !validateString(projectEntity.projectName) && errMessage.push("projectName is valid.");
        !validateDeptId(projectEntity.deptId) && errMessage.push("deptId must like 'D***   .");
        !validateNumber(projectEntity.leaderId) && errMessage.push("leaderId must be number.");
        !validateNumber(projectEntity.minExp) && errMessage.push("minExp must be number.");

        if (errMessage.length === 0) {
            return next();
        }

        return next({
            error: new Error("INVALID_PROJECT_INPUT_BY_CLIENT"),
            args: errMessage
        });
    }
}