const {
    listDeptsService,
    createDeptService,
    searchDeptService,
    deleteByIdService,
    updateByIdService,
    createDeptViewService
} = require('../services/deptService')

const DeptModel = require("../models/deptModel")
const { StatusCodes } = require('http-status-codes')
const JwtService = require("../services/JWTService");

// list depts
const listDeptsByRoles = (req, res, next) => {
    const authorization = req.headers['authorization'] || '';
    const token = authorization.split('Bearer ')[1];
    const decoded = JwtService.decode(token);

    const member = {
        memberId: decoded.userId,
        roles: decoded.roles
    }

    listDeptsService(
        member,
        function (err, result) {
            if (err) {
                next(err);
            }
            return res.status(StatusCodes.OK).json({
                listDept: result
            })
        }
    )
}


const createDeptView = (req, res, next) => {
    console.log(req.query.deptId)
    const deptId = req.query.deptId;
    createDeptViewService(
        deptId,
        function (err, result) {
            if (err) {
                return next(err)
            }
            return res.status(StatusCodes.OK).json({
                selectUser: result
            })
        }
    )
};


const createDept = (req, res, next) => {
    const authorization = req.headers['authorization'] || '';
    const token = authorization.split('Bearer ')[1];

    const decoded = JwtService.decode(token);

    const deptEntity = {
        deptName: req.body.deptName,
        authorId: decoded.userId,
        authorExp: decoded.exps,
        selectMembers: req.body.selectMembers
    }

    console.log(deptEntity, "deptEntity");
    DeptModel.isExistDeptName(
        deptEntity.deptName,
        function (err, { isDeptNameExist }) {
            if (err) {
                return next(err);
            }
            console.log("dept here", isDeptNameExist);
            if (!isDeptNameExist) {
                console.log("dept not exists")
                createDeptService(
                    deptEntity,
                    (error, { hasCreateDept, hasAddMembers }) => {
                        if (error) {
                            next(error);
                        }
                        if (hasCreateDept) {
                            return res.status(StatusCodes.OK).json({
                                registerMessage: "Register successfully",
                                hasAddMembers: hasAddMembers
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


const updateById = (req, res, next) => {
    const deptModel = {
        deptId: req.body.deptId,
        deptName: req.body.deptName
    }

    updateByIdService(
        deptModel,
        function (err, { isExistDept, hasUpdate }) {
            if (err) {
                return next(err);
            }

            console.log(isExistDept, hasUpdate, hasUpdate.hasUpdate);
            if (!isExistDept) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    errorMessage: "Dept not found"
                })
            } if (hasUpdate.hasUpdate) {
                return res.status(StatusCodes.OK).json({
                    successMessage: "Update dept successfully"
                })
            }

        }
    )
}

module.exports = {
    listDeptsByRoles,
    createDeptView,
    createDept,
    searchDept,
    deleteById,
    updateById
}

