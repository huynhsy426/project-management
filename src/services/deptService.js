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
const createDeptService = (dept, results) => {
    DeptModel.isExistDept(
        dept.dept_id,
        function (err, isDeptExist) {
            if (err) {
                return results(err, null)
            }

            if (!isDeptExist) {
                DeptModel.isExistDeptName(
                    dept.dept_name,
                    function (err, isExistDeptName) {
                        if (err) {
                            return results(err, null)
                        }

                        if (isExistDeptName) {
                            return results(null, "isExistName")
                        } else {
                            DeptModel.createDept(
                                dept,
                                function (err, isCreateDept) {
                                    if (err) {
                                        return results(err, null)
                                    }

                                    return results(null, !isCreateDept)
                                }
                            )
                        }
                    }
                )
            } else {
                return results(null, isDeptExist)
            }
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