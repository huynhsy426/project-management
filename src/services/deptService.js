const DeptModel = require("../models/deptModel");
const MemberModel = require("../models/memberModel");
const MemberService = require("../services/memberService");


class DeptService {

    constructor() { }

    listDepts = ({ userId, roles }, callback) => {
        DeptModel.getDepts(
            { userId, roles },
            function (err, listDeptByUser) {
                if (err) {
                    return callback(err);
                }
                return callback(null, listDeptByUser);
            }
        )
    }


    createDept = ({ newDept, members }, callback) => {
        DeptModel.getDeptByName(newDept.deptName, function(err, deptByName) {
            if (err) {
                return callback(err)
            }
            if (deptByName.length > 0) {
                return callback(new Error('DEPT_NAME_USING'));
            }

            DeptModel.getNewDeptId(function(err, newDeptId) {
                if (err) {
                    return callback(err);
                }
                DeptModel.createDept(
                    {
                        deptId: newDeptId,
                        ...newDept
                    },
                    function (error, result) {
                        if (error) {
                            return callback(error);
                        }
                        if (!result) {
                            return callback(new Error('CREAT_DEPT_FAILED'));
                        }

                        // Add member to dept
                        MemberService.addMembersToDeptService(
                            { deptId: newDeptId, members, deptAuthorId: newDept.authorId },
                            callback
                        );
                    }
                )

            });
        });

    }


    // Search dept by name
    searchDeptService = (inputName, results) => {
        DeptModel.searchDeptByName(
            inputName,
            function (err, result) {
                if (err) {
                    return results(err, null)
                }
                console.log(result)
                return results(null, result)
            }
        )
    }


    // Delete dept by Id
    deleteByIdService = (dept_id, results) => {
        DeptModel.isExistDept(
            dept_id,
            function (err, result) {
                if (err) {
                    return results(err, null)
                }

                if (result) {
                    DeptModel.deleteById(
                        dept_id,
                        function (err, deleteResult) {
                            if (err) {
                                return results(err, null)
                            }
                            console.log(deleteResult)
                            return results(null, deleteResult)
                        }
                    )
                } else {
                    return results(null, result)
                }
            }
        )
    }


    // Update dept by Id
    updateByIdService = (dept, callback) => {
        DeptModel.updateById(
            dept,
            function (err, result) {
                if (err) {
                    return callback(err);
                }
                const isUpdate = result.affectedRows !== 0;
                return callback(null, isUpdate);
            }
        )
    }
}


const createAutoDeptId = (deptEntity, listDeptSort) => {
    const deptIdSplit = listDeptSort[listDeptSort.length - 1].deptId.split("D");
    const deptIdAutoChange = +deptIdSplit[1] + 1;
    deptEntity.deptId = "D000" + deptIdAutoChange;
    const memberList = [
        {
            memberId: deptEntity.authorId,
            deptId: deptEntity.deptId,
            position: "pm"
        }
    ]

    for (let member of deptEntity.members) {
        member = {
            memberId: member.memberId,
            deptId: deptEntity.deptId,
            position: member.position
        }
        memberList.push(member)
    }
    return memberList;
}


module.exports = new DeptService()