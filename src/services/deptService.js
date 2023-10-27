const mongoose = require("mongoose");
const DeptModel = require("../models/deptModel");
const UserModel = require("../models/userModel");


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


        try {
            const [result] = await DeptModel.insertMany(deptEntity);
            if (result === null) {
                throw (new Error('CREAT_DEPT_FAILED'));
            }
            dept.deptId = result._id;
            return;
        } catch (error) {
            throw error;
        }
    }
    let resultAddMember = false;
    return resultAddMember;

};

// Can sua
const listDeptsByRoles = async (userId, roles) => {
    console.log({ userId, roles })
    try {
        let result = null;
        if (roles === "Admin") {
            console.log("here admin");
            result = await DeptModel.find(
                {},
                { deptName: 1, authorId: 1, members: 1, _id: 0 }
            )
        } else {
            console.log("here user");
            const query = { _id: userId };

            result = await UserModel.findOne(
                query,
                { username: 1, depts: 1, _id: 0 }
            )
                .populate({
                    path: 'depts.deptId',
                    match: {
                        "members.memberId": '6528c701d67c305e6fff8276'
                    },
                    select: { 'memebers.memberId': '6528c701d67c305e6fff8276' },
                })
        }
        console.log({ result })
        return result;
    } catch (error) {
        throw error;
    }
};


const isExistDeptName = async (deptName) => {
    try {
        const result = await DeptModel.findOne(
            { deptName: deptName },
            { 1: 1 }
        );
        if (result !== null) {
            throw (new Error("DEPTNAME_UNIQUE"));
        }

        console.log("isHere isss")
        return;
    } catch (err) {
        throw err;
    }
};


// Search dept by deptName
const searchDeptByName = async (inputName) => {
    try {
        const result = await DeptModel.find(
            { deptName: new RegExp(inputName) }
        )
        console.log({ result })
        return result;
    } catch (error) {
        throw error;
    }
};


// Delete dept by Id
const deleteById = async (deptId) => {
    try {
        const result = await DeptModel.deleteById(deptId);
        if (result.deletedCount === 0) {
            return false;
        }
        return;
    } catch (error) {
        throw error;
    }
};


// Update dept by Id
const updateById = async (deptId, deptName) => {
    console.log({ deptId, deptName });
    try {
        const result = await DeptModel.updateMany(
            { _id: deptId },
            { $set: { deptName: deptName } }
        );
        console.log({ result });
        let isUpdate = true;
        if (result.matchedCount === 0) {
            return !isUpdate;
        } return isUpdate;
    } catch (error) {
        throw error;
    }
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

    try {
        const result = await UserModel.find(
            { _id: { $in: listMemberId } }
        )
        console.log({ result })
        if (result.length !== listMemberId.length) {
            throw new Error("USER_NOT_EXIST");
        }
        return;
    } catch (err) {
        throw err;
    }
}

// Check member blocked
const checkMemberIsBlockAndRoles = async (members) => {
    try {
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
            throw (new Error("ADD_MEMBER_BLOCK"));
        }

        const resultCheckRoles = await UserModel.find(
            {
                _id: { $in: listMemberId },
                roles: "Admin"
            },
            { roles: 1, _id: 0 }
        )

        if (resultCheckRoles.length > 0) {
            throw (new Error('NOT_ALLOW_ROLE'));
        }
        return;


    } catch (error) {
        throw error;
    }
};


// update user to dept
// const updateUserToDept = async (members, deptId) => {
//     const listMemberId = members.map((value) => { return (value.memberId) });
//     try {
//         let query = { _id: { $in: listMemberId } };
//         let dept = { deptId: new mongoose.Types.ObjectId(deptId) };
//         await UserModel.updateMany(
//             query,
//             {
//                 $push: {
//                     depts: dept
//                 }
//             }
//         )
//         return;
//     } catch (error) {
//         throw error;
//     }
// };



// Check member in dept or blocked
const checkMemberInDeptOrIsBlock = async (members, deptId) => {
    try {
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
            { 1: 1 }
        )

        if (result !== null) {
            throw (new Error("ADD_MEMBER_BLOCK"));
        }

        const resultCheckRoles = await UserModel.findOne(
            {
                _id: { $in: listMemberId },
                roles: "Admin"
            },
            { roles: 1, _id: 0 }
        )

        if (resultCheckRoles !== null) {
            throw (new Error('NOT_ALLOW_ROLE'));
        }

        console.log({ deptId })
        const resultIndept = await DeptModel.findOne(
            {
                _id: new mongoose.Types.ObjectId(deptId),
            },
            { members: 1, _id: 0 }
        )

        console.log({ asd: resultIndept.members })

        const inDeptList = [];
        resultIndept.members.forEach(element => {
            let memberId = JSON.stringify(element.memberId).split('"')[1];
            if (listMemberId.includes(memberId)) {
                inDeptList.push(memberId);
                return;
            }
        });

        if (inDeptList.length > 0) {
            throw (new Error("MEMBER_ALREADY_IN_DEPT"))
        }
        return;
    } catch (error) {
        throw error;
    }
}


const addMemberToDept = async (members, deptId) => {
    const listMembers = members.map(member => {
        return member = {
            memberId: new mongoose.Types.ObjectId(member.memberId),
            position: member.position
        }
    });
    try {
        const query = { id: deptId };
        const result = await DeptModel.updateMany(
            query,
            {
                $push: {
                    members: { $each: listMembers }
                }
            }
        )

        return result;
    } catch (error) {
        throw error;
    }
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
        try {
            // Check dept name
            await isExistDeptName(deptEntity.deptName);
            // After validation all create dept and add members to dept and deptId
            await createDept(deptEntity);
            // const resultUpdateUser = await updateUserToDept(deptEntity.members, deptEntity.deptId);
            return;
        } catch (err) {
            throw err;
        }
    },


    // Search dept by name
    searchDept: (inputName) => {
        if (inputName === null) {
            throw new Error("SEARCH_NAME_NULL")
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
        try {
            await checkMemberInDeptOrIsBlock(members, deptId);
            const result = await addMemberToDept(members, deptId);
            return result;
        } catch (err) {
            throw err;
        }
    }
}