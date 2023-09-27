const DeptModel = require("../models/deptModel")


const listDeptsService = (results) => {
    DeptModel.listDepts(
        function (err, result) {
            if (err) {
                return results(err, null)
            }

            return results(null, result)
        }
    )
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
            const deptIdSplit = listDeptSort[0].deptId.split("D");
            console.log(deptIdSplit);
            const deptIdAutoChange = +deptIdSplit[1] + 1;
            deptEntity.deptId = "D000" + deptIdAutoChange;
            console.log(deptEntity, "deptEntity")
            DeptModel.createDept(
                deptEntity,
                function (error, hasCreateDept) {
                    if (error) {
                        callback(error);
                    }
                    return callback(null, hasCreateDept);
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
const updateByIdService = (dept, results) => {
    DeptModel.isExistDept(
        dept.dept_id,
        function (err, result) {
            if (err) {
                return results(err, null)
            }

            if (result) {
                DeptModel.updateById(
                    dept,
                    function (err, updateResult) {
                        if (err) {
                            return results(err, null)
                        }
                        return results(null, updateResult)
                    }
                )
            } else {
                return results(null, result)
            }
        }
    )
}


module.exports = {
    listDeptsService,
    createDeptService,
    searchDeptService,
    deleteByIdService,
    updateByIdService
}