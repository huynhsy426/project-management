const DeptModel = require("../models/deptModel");
const DeptService = require("../services/deptService");
const { StatusCodes } = require('http-status-codes');
const JwtService = require("../services/JWTService");
const MemberService = require("../services/memberService");

class DeptController {

    constructor() { }

    // List dept by roles of user
    listDeptsByRoles = (req, res, next) => {
        const { userId, roles } = req.user

        DeptService.listDeptsByRoles(
            { memberId: userId, roles: roles },
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

    // Validate du lieu
    // Check member block thi khong cho phep add vao phong ban
    // Check member da trung thi khong cho add them vao
    createDept = (req, res, next) => {
        const { members, deptName } = req.body;
        const { userId, exp } = req.user;

        console.log(members, "asdlkj members");
        const deptEntity = {
            deptId: '',
            deptName: deptName,
            authorId: userId,
            authorExp: exp,
        }
        console.log(deptEntity)

        // Check members of listSelect
        MemberService.checkMemberInDeptOrIsBlock(
            { memberSelect: members },
            (error) => {
                if (error) {
                    return next(error);
                }

                DeptService.createDept(
                    { deptEntity, members },
                    function (err, result) {
                        if (err) {
                            return next(err);
                        }

                        if (result.affectedRows === 0) {
                            return res.status(StatusCodes.CREATED).json({
                                createMessage: "Create unsuccessful"
                            })
                        }

                        return res.status(StatusCodes.CREATED).json({
                            createMessage: "Create Dept successfully"
                        })

                    }
                )

            }
        )
    };


    searchDept = (req, res) => {
        DeptService.searchDept(
            req.query.inputName,
            function (err, searchResult) {
                if (err) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        errorMessage: err
                    })
                }

                return res.status(StatusCodes.OK).json({
                    deptList: searchResult
                })
            }
        )
    };


    deleteById = (req, res) => {
        DeptService.deleteById(
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


    // Update by dept Id 
    // Just update name
    updateById = (req, res, next) => {
        const deptModel = {
            deptId: req.params.deptId,
            deptName: req.body.deptName
        }

        DeptService.updateById(
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
                return res.status(StatusCodes.OK).json({
                    errMessage: "Update successfully."
                })
            }
        )
    };


}


module.exports = new DeptController()
