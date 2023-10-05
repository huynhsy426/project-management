const { StatusCodes } = require('http-status-codes');
const MemberService = require('../services/memberService');

class MemberController {

    constructor() { }

    listMembersToJoin = (req, res, next) => {
        const deptId = req.params.deptId;
    };


    // Check validate first in middleware
    // Check members input isBlocked or in dept
    // Valid -> Add members to the dept
    addMembers = (req, res, next) => {
        const members = req.body.members;
        const deptId = req.params.deptId;
        MemberService.checkMemberInDeptOrIsBlock(
            { memberSelect: members, deptId },
            function (err) {
                if (err) {
                    return next(err);
                }

                MemberService.addMembersToDept(
                    { deptId, members },
                    function (err, result) {
                        if (err) {
                            return next(err);
                        }

                        if (result.affectedRows === 0) {
                            return res.status(StatusCodes.CREATED).json({
                                createMessage: "Add unsuccessful"
                            })
                        }

                        return res.status(StatusCodes.CREATED).json({
                            createMessage: "Add members successfully"
                        })
                    }

                )

            }
        )
    };
}


module.exports = new MemberController();