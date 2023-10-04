const DeptModel = require("../models/deptModel");
const DeptService = require("../services/deptService");
const { StatusCodes } = require('http-status-codes');
const JwtService = require("../services/JWTService");
const memberService = require("../services/memberService");

class DeptController {

    constructor() { }

    listDeptsByRoles = (req, res, next) => {
        const { userId, roles } = req.user
        DeptService.listDepts(
            { userId, roles },
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


    createDept = (req, res, next) => {
        // Validate du lieu
        // Check member block thi khong cho phep add vao phong ban
        // Check member da trung thi khong cho add them vao
        const { members, deptName } = req.body;
        const { userId: authorId, exp } = req.user;
        const newDept = {
            deptName,
            authorId,
            authorExp: exp,
        }

        memberService.checkMemberInDeptOrIsBlock(
            { memberSelect: members },
            (error) => {
                if (error) {
                    return next(error);
                }

                DeptService.createDept(
                    { newDept, members },
                    function (err, result) {
                        if (err) {
                            return next(err);
                        }
                        return res.status(200).json(result);
                    }
                )

            }
        )
    };


    searchDept = (req, res) => {
        DeptService.searchDeptService(
            req.query.inputName,
            function (err, searchResult) {
                if (err) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
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
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        errorMessage: err
                    })
                }

                if (!result) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        errorMessage: "Dept not found"
                    })
                }
                return res.status(StatusCodes.OK).json({
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
            function (err, isUpdate) {
                if (err) {
                    return next(err);
                }
                if (!isUpdate) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        errMessage: "Dept Id not found."
                    })
                }
                return isUpdate ?
                    res.status(StatusCodes.OK).json({
                        errMessage: "Update successfully."
                    }) :
                    res.status(StatusCodes.BAD_REQUEST).json({
                        errMessage: "Dept Id not found."
                    })


            }
        )
    }


}


module.exports = new DeptController()
