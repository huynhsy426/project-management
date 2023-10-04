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
        MemberService.checkMemberInDeptOrIsBlock(
            { memberSelect: membersSelect, deptId },
            function (err) {
                if (err) {
                    return next(err);
                }

                MemberService.addMembersToDeptService(
                    { deptId, membersSelect },
                    function (error, hasAddMembers) {
                        if (error) {
                            return next(error);
                        }
                        console.log(hasAddMembers, "asdkjh")
                        return res.json({});
                    }
                )
            }
        )
    };
}


module.exports = new MemberController();