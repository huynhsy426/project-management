const {
    listDeptsService,
    createDeptService,
    searchDeptService,
    deleteByIdService,
    updateByIdService
} = require('../services/deptService')

const DeptModel = require("../models/deptModel")

// list depts
const listDepts = (req, res) => {
    listDeptsService(
        function (err, result) {
            if (err) {
                return res.status(400).json({
                    errorMessage: err
                })
            }

            return res.status(200).json({
                deptList: result
            })
        }
    )
}


const createDept = (req, res, next) => {

    const deptEntity = {
        deptId: req.body.deptId,
        deptName: req.body.deptName,
        authorId: req.body.authorId
    }

    DeptModel.isExistDeptName(
        deptEntity.deptName,
        function (err, isDeptNameExist) {
            if (err) {
                return next(err);
            }
            console.log("dept here", isDeptNameExist);
            if (!isDeptNameExist) {
                console.log("dept not exists")
                createDeptService(
                    deptEntity,
                    (error, hasCreateDept) => {
                        if (error) {
                            next(error);
                        }
                        if (hasCreateDept) {
                            return res.status(StatusCodes.OK).json({
                                registerMessage: "Register successfully"
                            })
                        }
                    }
                )
            }

        }
    )
}


const searchDept = (req, res) => {
    searchDeptService(
        req.query.inputName,
        function (err, searchResult) {
            if (err) {
                return res.status(400).json({
                    errorMessage: err
                })
            }

            return res.status(200).json({
                deptList: searchResult
            })
        }
    )
}


const deleteById = (req, res) => {
    deleteByIdService(
        req.params.dept_id,
        function (err, result) {
            if (err) {
                return res.status(400).json({
                    errorMessage: err
                })
            }

            if (!result) {
                return res.status(200).json({
                    errorMessage: "Dept not found"
                })
            }
            return res.status(200).json({
                deptList: result,
                successMessage: "Delete dept successfully"
            })
        }
    )
}


const updateById = (req, res) => {
    const deptModel = {
        dept_id: req.body.dept_id,
        dept_name: req.body.dept_name
    }

    updateByIdService(
        deptModel,
        function (err, result) {
            if (err) {
                return res.status(400).json({
                    errorMessage: err
                })
            }

            if (!result) {
                return res.status(200).json({
                    errorMessage: "Dept not found"
                })
            }
            return res.status(200).json({
                deptList: result,
                successMessage: "Delete dept successfully"
            })
        }
    )
}

module.exports = {
    listDepts,
    createDept,
    searchDept,
    deleteById,
    updateById
}

