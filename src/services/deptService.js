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
            // Check dept name
            console.log("hehehe")
            await DeptModel.isExistDeptName(deptEntity.deptName);

            // Create auto DeptId
            const newDeptId = await DeptModel.createAutoDeptId();
            deptEntity.deptId = newDeptId;

            // After validation all create dept and add members to dept
            await DeptModel.createDept(deptEntity);

            // Add members to dept
            const resultAddMember = await MemberService.addMembersToDept(
                { deptId: deptEntity.deptId, members, authorId: deptEntity.authorId }
            )
            return resultAddMember;
        } catch (err) {
            throw err;
        }
    }


    // Search dept by name
    searchDept = (inputName) => {
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