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


const validateMemberId = (members, errMessage) => {
    const duplicateMembers = members.filter((member, index, self) =>
        self.findIndex((m) => m.memberId === member.memberId) !== index
    );
    duplicateMembers.length > 0 && errMessage.push(`memberId ${duplicateMembers[0].memberId} is already exists`)
};


const validateMemberIdFormat = (members, errMessage) => {
    members.map((member) => {
        !validateNumber(member.memberId) && errMessage.push(`memberId ${member.memberId} not valid`);
    })
};


const validatePosition = (members, errMessage) => {
    members.map((member) => {
        !validateString(member.position) && errMessage.push(`Position ${member.position} not valid`);
    })
};


module.exports = {
    validateDept: (req, res, next) => {
        const deptEntity = {
            deptId: req.body.deptId,
            deptName: req.body.deptName,
            members: req.body.members
        }

        const errMessage = []

        console.log(deptEntity, "Dept Entity")

        !validateString(deptEntity.deptName) && errMessage.push("dept name is valid");
        validateMemberIdFormat(deptEntity.members, errMessage);
        validateMemberId(deptEntity.members, errMessage);
        validatePosition(deptEntity.members, errMessage);

        if (errMessage.length === 0) {
            return next();
        }

        return next({
            error: new Error("INVALID_DEPT_INPUT_BY_CLIENT"),
            args: errMessage
        });
    }
}