const memberModel = require("../models/memberModel");
const userModel = require("../models/userModel");
const projectModel = require("../models/projectModel");


const listMembers = async () => {
    try {
        const result = await memberModel.find(
            {},
            { memberId: 1, deptId: 1, position: 1, _id: 0 }
        );
        console.log({ result });
        return result;
    } catch (error) {
        throw error;
    }
};


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


// Check member in dept or blocked
const checkMemberInDeptOrIsBlock = async (members, deptId) => {
    try {
        console.log("herecheck member")
        let listMemberId = "";
        if (members.length !== 0) {
            listMemberId = members.map((value) => { return (value.memberId.trim()) });
        } else {
            listMemberId = 0;
        }
        const result = await userModel.find(
            {
                _id: { $in: listMemberId },
                isBlocked: true
            },
            { username: 1, roles: 1, _id: 0 }
        )

        console.log({ result1111: result })
        if (result.length > 0) {
            throw (new Error("ADD_MEMBER_BLOCK"));
        }

        const resultCheckRoles = await userModel.find(
            {
                _id: { $in: listMemberId },
                roles: "Admin"
            },
            { roles: 1, _id: 0 }
        )

        if (resultCheckRoles.length > 0) {
            throw (new Error('NOT_ALLOW_ROLE'));
        }

        if (!deptId) {
            return;
        }

        const resultIndept = await memberModel.find(
            {
                memberId: { $in: listMemberId },
                deptId: deptId
            },
            { 1: 1 }
        )
        console.log({ resultIndept })
        if (resultIndept.length > 0) {
            throw (new Error("MEMBER_ALREADY_IN_DEPT"))
        }
        return;


    } catch (error) {
        throw error;
    }
}


// Check member in project
const checkMemberInProject = async (memberId) => {

    try {
        const result = await memberModel.find(
            { memberId: memberId },
            { deptId: 1, _id: 0 }
        )
        const listDeptId = result.map(item => {
            return item.deptId;
        })

        const isInDept = await projectModel.findOne(
            { deptId: { $in: listDeptId } },
            { 1: 1 }
        )

        if (isInDept !== null) {
            throw new Error("MEMBERS_CANNOT_DELETE");
        }
        return;
    } catch (error) {
        throw error;
    }
};


// Delete member out dept
const deleteMember = async (memberId, deptId) => {
    try {
        const result = await memberModel.deleteMany(
            { memberId: memberId, deptId: deptId }
        )

        if (result.deletedCount === 0) {
            throw new Error("MEMBER_NOT_IN_DEPT_FOR_DEPT");
        }
        return;
    } catch (err) {
        throw err;
    }
};

module.exports = {
    // Kiem tra isBlock Or co ton tai trong Dept 
    checkMemberInDeptOrIsBlock: (members, deptId) => {
        return checkMemberInDeptOrIsBlock(members, deptId)
    },


    // Create memberList by members for insert
    // if has authorId add author to dept
    // Else not add
    // add memberList To Dept
    addMembersToDept: async ({ deptId, members }) => {
        const memberList = members.map(member => {
            return {
                memberId: member.memberId,
                deptId: deptId,
                position: member.position
            }
        })

        if (memberList.length > 0) {
            return await insertMembers(deptId, memberList)
        }

        let resultAddMember = false;
        return resultAddMember;
    },

    // Check member is in project
    // If no Delete member
    delete: async (memberId, deptId) => {
        try {
            await checkMemberInProject(memberId);
            await deleteMember(memberId, deptId);
        } catch (err) {
            throw err;
        }
    }
}