const DeptModel = require("../models/deptModel");
const MemberService = require("../services/memberService");


class DeptService {

    constructor() { }

    listDeptsByRoles = ({ memberId, roles }, callback) => {
        DeptModel.listDeptsByRole(
            { memberId, roles },
            callback
        )
    }


    // Create new Dept
    createDept = ({ deptEntity, members }, callback) => {
        // Check dept name
        DeptModel.isExistDeptName(
            deptEntity.deptName,
            (err) => {
                if (err) {
                    return callback(err);
                }

                DeptModel.createAutoDeptId(
                    function (err, newDeptId) {
                        if (err) {
                            return callback(err);
                        }
                        deptEntity.deptId = newDeptId;

                        // After validation all create dept and add members to dept
                        DeptModel.createDept(
                            deptEntity,
                            function (error, resultCreateDept) {
                                if (error) {
                                    return callback(err);
                                }

                                if (resultCreateDept.affectedRows !== 1) {
                                    return callback(new Error('CREAT_DEPT_FAILED'));
                                }

                                MemberService.addMembersToDept(
                                    { deptId: deptEntity.deptId, members, authorId: deptEntity.authorId },
                                    callback
                                )
                            }
                        )
                    }
                )
            }
        )
    }


    // Search dept by name
    searchDept = (inputName, callback) => {
        DeptModel.searchDeptByName(inputName, callback)
    }


    // Delete dept by Id
    deleteById = (dept_id, results) => { }


    // Update dept by Id
    updateById = (dept, callback) => {
        DeptModel.updateById(dept, callback)
    }
}


module.exports = new DeptService()