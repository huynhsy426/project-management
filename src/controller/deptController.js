const DeptService = require("../services/deptService");
const { StatusCodes } = require('http-status-codes');
const JwtService = require("../services/JWTService");
const MemberService = require("../services/memberService");

class DeptController {

    constructor() { }

    // List dept by roles of user
    listDeptsByRoles = (req, res, next) => {
        const { userId, roles } = req.user

        DeptService.listDeptsByRoles(userId, roles)
            .then((listDeptByUser) => {
                return res.status(StatusCodes.OK).json({
                    listDept: listDeptByUser
                })
            })
            .catch(err => {
                return next(err);
            });
    };

    // Validate du lieu
    // Check member block thi khong cho phep add vao phong ban
    // Check member da trung thi khong cho add them vao
    createDept = (req, res, next) => {
        const { members, deptName } = req.body;
        const { userId } = req.user;

        console.log(members, "asdlkj members");
        const deptEntity = {
            deptId: '',
            deptName: deptName,
            authorId: userId
        }
        console.log(deptEntity)

        // Check members of listSelect
        MemberService.checkMemberInDeptOrIsBlock(members)
            .then(() => {
                console.log('1111')
                return DeptService.createDept(deptEntity, members)
            })
            .then((resultAddMember) => {
                if (!resultAddMember) {
                    DeptService.deleteById(deptEntity.deptId)
                        .then(() => { console.log("Delete successfully") })
                        .catch(err => { return next(err) });

                    return res.status(StatusCodes.BAD_REQUEST).json({
                        createMessage: "Create unsuccessful"
                    })
                }

                return res.status(StatusCodes.CREATED).json({
                    createMessage: "Create Dept successfully"
                })

            })
            .catch(err => {
                return next(err);
            })

    }



    searchDept = (req, res, next) => {
        const { deptName } = req.params;
        console.log(deptName, "search")
        DeptService.searchDept(deptName)
            .then(searchResult => {
                return res.status(StatusCodes.OK).json({
                    deptList: searchResult
                })
            })
            .catch(err => {
                return next(err);
            });
    };


    deleteById = (req, res, next) => {
        const { deptId } = req.params;
        DeptService.deleteById(deptId)
            .then((result) => {
                if (!result) {
                    res.status(StatusCodes.BAD_REQUEST).json({
                        message: "delete failed!!!"
                    })
                }
                res.status(StatusCodes.OK).json({
                    message: "delete succeeded!!!"
                })
            })
            .catch(err => {
                return next(err)
            });
    };


    // Update by dept Id 
    // Just update name
    updateById = (req, res, next) => {
        const deptId = req.params.deptId;
        const deptName = req.body.deptName;


        DeptService.updateById({ deptId, deptName })
            .then(isUpdate => {
                if (!isUpdate) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        errMessage: "Dept Id not found."
                    })
                }
                return res.status(StatusCodes.OK).json({
                    errMessage: "Update successfully."
                })
            })
            .catch(err => {
                return next(err);
            });
    };

}



module.exports = new DeptController()
