const DeptModel = require("../models/deptModel");
const MemberService = require("../services/memberService");


class DeptService {

    constructor() { }

    listDeptsByRoles = (userId, roles) => {
        return DeptModel.listDeptsByRoles(userId, roles);
    }


    // Create new Dept
    createDept = (deptEntity, members) => {
        // Check dept name
        return DeptModel.isExistDeptName(deptEntity.deptName)
            .then(() => {
                return DeptModel.createAutoDeptId();
            })
            .then(newDeptId => {
                deptEntity.deptId = newDeptId;

                // After validation all create dept and add members to dept
                return DeptModel.createDept(deptEntity);
            })
            .then(() => {
                return MemberService.addMembersToDept(
                    { deptId: deptEntity.deptId, members, authorId: deptEntity.authorId }
                )
            })
            .then((resultAddMember) => {
                return resultAddMember;
            })
            .catch(err => {
                throw err;
            });
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
    updateById = ({ deptId, deptName }) => {
        return DeptModel.updateById({ deptId, deptName });
    }
}


module.exports = new DeptService()