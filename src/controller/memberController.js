const { StatusCodes } = require('http-status-codes');
const MemberService = require('../services/memberService');

class MemberController {

    constructor() { }

    checkMemberForDept = (req, res, next) => {
        const deptId = req.params.deptId;
        // MemberService.checkMembersToDeptService(
        //     deptId,
        //     function (err, result) {
        //         if (err) {
        //             return next(err);
        //         }
        //         return res.status(StatusCodes.OK).json({
        //             result
        //         })
        //     })
    };


    addMembersToDept = (req, res, next) => {
        const membersSelect = req.body.members;
        const deptId = req.params.deptId;
        console.log(membersSelect, "lise n=mem aaa")
        MemberService.checkMembersToDeptService(
            { memberSelect: membersSelect, deptId },
            function (err, hasInsert) {
                console.log(hasInsert, "1")
                if (err) {
                    return next(err);
                }
                if (!hasInsert.hasInsert) {
                    return next(new Error('MEMBER_ID_CANNOT_JOIN_DEPT'));
                } else {
                    MemberService.addMembersToDeptService(
                        { deptId, membersSelect },
                        function (error, hasAddMembers) {
                            if (error) {
                                return callback(error);
                            }
                            console.log(hasAddMembers, "asdkjh")
                            return callback(null, { hasCreateDept, hasAddMembers });
                        }
                    )
                }
            }
        )
    };
}


module.exports = new MemberController();