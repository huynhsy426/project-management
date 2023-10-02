const DeptModel = require("../models/deptModel");
const MemberModel = require("../models/memberModel")


const listDeptsService = (member, callback) => {
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


const createDeptViewService = (deptId, callback) => {
    DeptModel.selectMemberForDept(
        deptId,
        function (err, result) {
            if (err) {
                return callback(err)
            }
            return callback(null, result)
        })
}


// Create new Dept
const createDeptService = (dept, callback) => {
    console.log(dept, 'create dept');
    const deptEntity = {
        deptId: dept.deptId,
        deptName: dept.deptName,
        authorId: dept.authorId
    }

    DeptModel.listDeptsSortId(
        function (err, listDeptSort) {
            if (err) {
                return callback(err);
            }
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
            for (let index = 0; index < dept.selectMembers.length; index++) {
                let member = {
                    memberId: dept.selectMembers[index].memberId,
                    deptId: deptEntity.deptId,
                    position: dept.selectMembers[index].position
                }
                memberList.push(member)
            }
            console.log(memberList, "mmembers list");
            DeptModel.createDept(
                deptEntity,
                function (error, { hasCreateDept }) {
                    if (error) {
                        callback(error);
                    }
                    MemberModel.insertSelectMember(
                        memberList,
                        function (error, hasAddMembers) {
                            if (error) {
                                return callback(error);
                            }
                            console.log(hasAddMembers, "asdkjh")
                            return callback(null, { hasCreateDept, hasAddMembers });
                        }
                    )

                }
            )
        }
    )


}


// Search dept by name
const searchDeptService = (inputName, results) => {
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
const deleteByIdService = (dept_id, results) => {
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
const updateByIdService = (dept, callback) => {
    DeptModel.isExistDept(
        dept.deptId,
        function (err, isExistDept) {
            if (err) {
                return callback(err)
            }
            console.log(isExistDept)
            if (!isExistDept) {
                return callback(null, { isExistDept: false })
            }
            DeptModel.updateById(
                dept,
                function (error, hasUpdate) {
                    if (error) {
                        return callback(error)
                    }
                    return callback(null, { isExistDept: true, hasUpdate })
                }
            )
        }
    )
}


module.exports = {
    listDeptsService,
    createDeptViewService,
    createDeptService,
    searchDeptService,
    deleteByIdService,
    updateByIdService
}