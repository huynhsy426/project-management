const DeptModel = require("../models/deptModel");
const UserModel = require("../models/userModel");
const ProjectModel = require("../models/projectModel");

const { ErrorCodes } = require("../constants/errorConstant");


// Create Dept
const createDept = async (dept) => {
    const deptEntity = {
        deptName: dept.deptName,
        members: dept.members
    }

    if (deptEntity.members.length > 0) {
        deptEntity.members.unshift({
            memberId: dept.authorId,
            position: "pm"
        });


        const [result] = await DeptModel.insertMany(deptEntity);
        if (result === null) {
            throw (new Error(ErrorCodes.CREAT_DEPT_FAILED));
        }
        dept.deptId = result._id;
        return;
    }
    let resultAddMember = false;
    return resultAddMember;

};

// Can sua
const listDeptsByRoles = async (userId, roles) => {
    let result = null;
    if (roles === "Admin") {
        result = await DeptModel.find(
            {},
            { deptName: 1, members: 1, _id: 0 }
        )
    } else {
        const query = { "members.memberId": userId };

        const resultDeptList = await DeptModel.find(
            query,
            { deptName: 1, members: 1, _id: 0 }
        )
            .populate(
                {
                    path: 'members.memberId',
                    match: {
                        "_id": userId
                    },

                    select: { "members.position": 1, "_id": 1, username: 1 }
                }
            )

        result = resultDeptList.map(dept => {
            const arrMembers = dept.members;
            const newArr = arrMembers.filter(member => {
                return member.memberId !== null
            })
            return {
                deptName: dept.deptName,
                members: newArr
            }
        })
    }
    return result;
};


const isExistDeptName = async (deptName) => {
    const result = await DeptModel.findOne(
        { deptName: deptName },
        { _id: 1 }
    ).lean();
    if (result) {
        throw (new Error(ErrorCodes.DEPTNAME_UNIQUE));
    }
    return;
};


// Search dept by deptName
const searchDeptByName = async (inputName) => {
    const result = await DeptModel.find(
        { deptName: new RegExp(inputName) }
    )
    return result;
};


// Delete dept by Id
const deleteById = async (deptId) => {
    const result = await DeptModel.deleteById(deptId);
    if (result.deletedCount === 0) {
        return false;
    }
    return;
};


// Update dept by Id
const updateById = async (deptId, deptName) => {
    const result = await DeptModel.updateMany(
        { _id: deptId },
        { $set: { deptName: deptName } }
    );
    let isUpdate = true;
    if (result.matchedCount === 0) {
        return !isUpdate;
    }
    return isUpdate;
};



// -----------------------------------------------------------
//                      members


// 
const checkMemberIsExist = async (members) => {
    let listMemberId = "";
    if (members.length !== 0) {
        listMemberId = members.map((value) => { return (value.memberId.trim()) });
    } else {
        listMemberId = 0;
    }

    const result = await UserModel.find(
        { _id: { $in: listMemberId } }
    )
    if (result.length !== listMemberId.length) {
        throw new Error(ErrorCodes.USER_NOT_EXIST);
    }
    return;
}

// Check member blocked
const checkMemberIsBlockAndRoles = async (members) => {
    let listMemberId = "";
    if (members.length !== 0) {
        listMemberId = members.map((value) => { return (value.memberId.trim()) });
    } else {
        listMemberId = 0;
    }
    const result = await UserModel.find(
        {
            _id: { $in: listMemberId },
            isBlocked: true
        },
        { username: 1, roles: 1, _id: 0 }
    )

    if (result.length > 0) {
        throw (new Error(ErrorCodes.ADD_MEMBER_BLOCK));
    }

    const resultCheckRoles = await UserModel.find(
        {
            _id: { $in: listMemberId },
            roles: "Admin"
        },
        { roles: 1, _id: 0 }
    )

    if (resultCheckRoles.length > 0) {
        throw (new Error(ErrorCodes.NOT_ALLOW_ROLE));
    }
    return;
};


// Check member in dept or blocked
const checkMemberInDeptOrIsBlock = async (members, deptId) => {
    let listMemberId = "";
    if (members.length !== 0) {
        listMemberId = members.map((value) => { return (value.memberId.trim()) });
    } else {
        listMemberId = 0;
    }
    const query = {
        _id: { $in: listMemberId },
        isBlocked: true
    };
    const result = await UserModel.findOne(
        query,
        { _id: 1 }
    ).lean();

    if (result) {
        throw (new Error(ErrorCodes.ADD_MEMBER_BLOCK));
    }

    const resultCheckRoles = await UserModel.findOne(
        {
            _id: { $in: listMemberId },
            roles: "Admin"
        },
        { roles: 1, _id: 0 }
    ).lean();

    if (resultCheckRoles) {
        throw (new Error(ErrorCodes.NOT_ALLOW_ROLE));
    }

    const resultIndept = await DeptModel.findOne(
        {
            _id: (deptId),
        },
        { members: 1, _id: 0 }
    ).lean();

    const inDeptList = [];
    resultIndept.members.forEach(element => {
        let memberId = JSON.stringify(element.memberId).split('"')[1];
        if (listMemberId.includes(memberId)) {
            inDeptList.push(memberId);
            return;
        }
    });

    if (inDeptList.length > 0) {
        throw (new Error(ErrorCodes.MEMBER_ALREADY_IN_DEPT))
    }
    return;
}


const addMemberToDept = async (members, deptId) => {
    const listMembers = members.map(member => {
        return member = {
            memberId: (member.memberId),
            position: member.position
        }
    });
    const query = { _id: deptId };
    const result = await DeptModel.updateMany(
        query,
        {
            $push: {
                members: { $each: listMembers }
            }
        }
    )

    return result;
}

// Check member in project
const checkMemberInProject = async (memberId) => {

    const result = await DeptModel.find(
        { "members.memberId": memberId },
        { _id: 1 }
    )
    const listDeptId = result.map(item => {
        return JSON.stringify(item._id).split('"')[1];
    })

    const isInDept = await ProjectModel.findOne(
        { deptId: { $in: listDeptId } },
        { _id: 1 }
    ).lean();

    if (isInDept) {
        throw new Error(ErrorCodes.MEMBERS_CANNOT_DELETE);
    }
    return;
};

// Remove member out of dept
const removeMember = async (memberId, deptId) => {
    const result = await DeptModel.updateOne(
        { _id: deptId },
        {
            $pull: {
                members: {
                    "memberId": memberId,
                }
            }
        }
    )

    if (result.upsertedCount === 0) {
        throw new Error(ErrorCodes.DELETE_UNSUCCESSFUL);
    }
    return;
}

module.exports = {
    // Kiem tra isBlock Or co ton tai trong Dept 
    checkMemberIsBlockAndRoles: (members) => {
        return checkMemberIsBlockAndRoles(members)
    },


    // Check members is exist
    checkMembersIsExist: (members) => {
        return checkMemberIsExist(members);
    },


    listDeptsByRoles: (userId, roles) => {
        return listDeptsByRoles(userId, roles);
    },


    // Create new Dept
    createDept: async (deptEntity) => {
        // Check dept name
        await isExistDeptName(deptEntity.deptName.trim());
        // After validation all create dept and add members to dept and deptId
        await createDept(deptEntity);
        return;
    },


    // Search dept by name
    searchDept: (inputName) => {
        if (inputName === null) {
            throw new Error(ErrorCodes.SEARCH_NAME_NULL)
        }
        return searchDeptByName(inputName);
    },


    // Delete dept by Id
    deleteById: (deptId) => {
        return deleteById(deptId);
    },


    // Update dept by Id
    updateById: (deptId, deptName) => {
        return updateById(deptId, deptName);
    },

    addMemberToDept: async (members, deptId) => {
        await checkMemberInDeptOrIsBlock(members, deptId);
        const result = await addMemberToDept(members, deptId);
        return result;
    },

    removeMember: async (memberId, deptId) => {
        await checkMemberInProject(memberId);
        await removeMember(memberId, deptId);
    }
}