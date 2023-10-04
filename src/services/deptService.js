const DeptModel = require("../models/deptModel");
const MemberModel = require("../models/memberModel");
const MemberService = require("../services/memberService");


class DeptService {

    constructor() { }

    listDeptsService = (member, callback) => {
        DeptModel.listDeptsByRole(
            member,
            function (err, listDeptByUser) {
                if (err) {
                    return callback(err);
                }
                return callback(null, listDeptByUser);
            }
        )
    }


    // Create new Dept
    createDeptService = (deptEntity, callback) => {
        console.log(deptEntity, 'create dept');

        // Create auto Id by sort the list 
        DeptModel.sortDeptById(
            function (err, listDeptSort) {
                if (err) {
                    return callback(err);
                }

                // Check name is exist 
                const listDepName = listDeptSort.map((item, index) => {
                    return (item.deptName);
                })

                const isExistDeptName = listDepName.includes(deptEntity.deptName);

                // if not exists create auto Id for create dept
                if (!isExistDeptName) {
                    const memberList = createAutoDeptId(deptEntity, listDeptSort);
                    DeptModel.createDept(
                        deptEntity,
                        function (error, hasCreateDept) {
                            if (error) {
                                callback(error);
                            }
                            if (hasCreateDept.hasCreateDept) {
                                // add member to dept
                                MemberService.addMembersToDeptService(
                                    { deptId: deptEntity.deptId, membersSelect: memberList },
                                    function (error, hasAddMembers) {
                                        if (error) {
                                            return callback(error);
                                        }
                                        return callback(null, { hasCreateDept, hasAddMembers });
                                    }
                                )
                            }

                        }
                    )
                } else {
                    return callback(new Error('DEPTNAME_UNIQUE'), { hasCreateDept: false, hasAddMembers: false })
                }
            }
        )
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