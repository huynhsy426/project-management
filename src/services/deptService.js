const deptModel = require("../models/deptModel");
const memberModel = require("../models/memberModel");

// Create Dept
const createDept = async (dept) => {
    const deptEntity = {
        deptName: dept.deptName,
        authorId: dept.authorId
    }
    try {
        const [result] = await deptModel.insertMany(deptEntity);
        console.log({ result });
        if (result === null) {
            throw (new Error('CREAT_DEPT_FAILED'));
        }
        dept.deptId = result._id;
        return;
    } catch (error) {
        throw error;
    }
};

const addMembersToDept = async ({ deptId, members, authorId }) => {
    const memberList = members.map(member => {
        return {
            memberId: member.memberId,
            deptId: deptId,
            position: member.position
        }
    })

    if (memberList.length > 0) {
        memberList.push({
            memberId: authorId,
            deptId: deptId,
            position: "pm"
        });
        return await insertMembers(deptId, memberList);
    };


    let resultAddMember = false;
    return resultAddMember;
}


// Insert member by select
const insertMembers = async (deptId, memberList) => {
    const listMembers = memberList.map(member => {
        return member = {
            memberId: member.memberId,
            deptId,
            position: member.position
        }
    });
    try {
        const result = await memberModel.insertMany(listMembers);
        return result;
    } catch (error) {
        throw error;
    }
}


const listDeptsByRoles = async (userId, roles) => {
    try {
        let result = null;
        if (roles === "Admin") {
            result = await deptModel.find(
                {},
                { deptName: 1, authorId: 1, _id: 0 }
            )
        } else {
            result = await memberModel.find(
                { memberId: userId },
                { memberId: 1, deptId: 1, position: 1, _id: 0 }
            )
                .populate({ path: 'deptId' })

        }
        return result;
    } catch (error) {
        throw error;
    }
};


const isExistDeptName = async (deptName) => {
    try {
        const result = await deptModel.findOne(
            { deptName: deptName },
            { 1: 1 }
        );
        if (result !== null) {
            throw (new Error("DEPTNAME_UNIQUE"));
        }
        return;
    } catch (err) {
        throw err;
    }
};


// Search dept by deptName
const searchDeptByName = async (inputName) => {
    try {
        const result = await deptModel.find(
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
        const result = await deptModel.deleteById(deptId);
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
        const result = await deptModel.updateMany(
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


module.exports = {
    listDeptsByRoles: (userId, roles) => {
        return listDeptsByRoles(userId, roles);
    },


    // Create new Dept
    createDept: async (deptEntity, members) => {
        try {
            // Check dept name
            await isExistDeptName(deptEntity.deptName);
            // After validation all create dept and add members to dept and deptId
            await createDept(deptEntity);
            // Add members to dept
            const resultAddMember = await addMembersToDept(
                { deptId: deptEntity.deptId, members, authorId: deptEntity.authorId }
            )
            return resultAddMember;
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
    }
}