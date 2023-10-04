const DeptModel = require("../models/deptModel");
const DeptService = require("../services/deptService");
const { StatusCodes } = require('http-status-codes');
const JwtService = require("../services/JWTService");
const memberService = require("../services/memberService");

class DeptController {

    constructor() { }

    listDeptsByRoles = (req, res, next) => {
        const { userId, roles } = req.user
        const member = {
            memberId: userId,
            roles: roles
        }

        DeptService.listDeptsService(
            member,
            function (err, result) {
                if (err) {
                    return next(err);
                }
                return res.status(StatusCodes.OK).json({
                    listDept: result
                })
            }
        )
    };


    createDeptView = (req, res, next) => {
        console.log(req.query.deptId)
        const deptId = req.query.deptId;
        DeptService.createDeptViewService(
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


    createDept = (req, res, next) => {
        // Validate du lieu
        // Check member block thi khong cho phep add vao phong ban
        // Check member da trung thi khong cho add them vao
        const { members, deptName } = req.body;
        const { userId, exps } = req.user;

        const deptEntity = {
            deptId: '',
            deptName: deptName,
            authorId: userId,
            authorExp: exps,
            members: members
        }
        console.log(deptEntity)

        // Check name is exist ?
        DeptModel.isExistDeptName(
            deptEntity.deptName,
            function (err, isDeptNameExist) {
                if (err) {
                    return next(err);
                }
                if (!isDeptNameExist.isDeptNameExist) {
                    console.log("dept not exists")

                    // Check member who can join dept before created dept
                    memberService.checkMembersToDeptService(
                        { memberSelect: members },
                        (error, hasInsert) => {
                            if (error) {
                                return next(error);
                            }
                            if (!hasInsert.hasInsert) {
                                return next(new Error('MEMBER_ID_CANNOT_JOIN_DEPT'));
                            }

                            // After validation all create dept and add members to dept
                            DeptService.createDeptService(
                                deptEntity,
                                function (err, { hasCreateDept, hasAddMembers }) {
                                    if (err) {
                                        return next(err);
                                    }
                                    if (hasAddMembers.hasAddMembers) {
                                        return res.status(StatusCodes.OK).json({
                                            hasCreateDept: hasCreateDept,
                                            hasAddMembers: "Create Dept successfully"
                                        })
                                    }
                                }
                            )

                        }
                    )
                }

            }
        )
    };


    searchDept = (req, res) => {
        DeptService.searchDeptService(
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
    };


    deleteById = (req, res) => {
        DeptService.deleteByIdService(
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
    };


    updateById = (req, res, next) => {
        const deptModel = {
            deptId: req.params.deptId,
            deptName: req.body.deptName
        }

        DeptService.updateByIdService(
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


}


module.exports = new DeptController()
