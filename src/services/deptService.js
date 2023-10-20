const DeptModel = require("../models/deptModel");
const MemberService = require("../services/memberService");


class DeptService {

    constructor() { }

    listDeptsByRoles = (userId, roles) => {
        return DeptModel.listDeptsByRoles(userId, roles);
    }


    // Create new Dept
    createDept = async (deptEntity, members) => {

        try {
            console.log("1")
            // Check dept name
            await DeptModel.isExistDeptName(deptEntity.deptName);
            console.log("2")
            // After validation all create dept and add members to dept and deptId
            await DeptModel.createDept(deptEntity);
            console.log("3")
            // Add members to dept
            const resultAddMember = await MemberService.addMembersToDept(
                { deptId: deptEntity.deptId, members, authorId: deptEntity.authorId }
            )
            console.log("4")
            return resultAddMember;
        } catch (err) {
            throw err;
        }
    }


    // Search dept by name
    searchDept = (inputName) => {
        if (inputName === null) {
            throw new Error("SEARCH_NAME_NULL")
        }
        return DeptModel.searchDeptByName(inputName);
    }


    // Delete dept by Id
    deleteById = (deptId) => {
        return DeptModel.deleteById(deptId);
    }


    // Update dept by Id
    updateById = (deptId, deptName) => {
        return DeptModel.updateById(deptId, deptName);
    }
}


module.exports = new DeptService()