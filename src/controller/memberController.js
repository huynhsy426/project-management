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
    addMembers = async (req, res, next) => {
        const members = req.body.members;
        const deptId = req.params.deptId;

        try {
            await MemberService.checkMemberInDeptOrIsBlock(members, deptId);

            const result = await MemberService.addMembersToDept({ deptId, members });
            console.log(result);
            console.log(result.affectedRows)
            if (!result || result.affectedRows === 0) {
                return res.status(StatusCodes.CREATED).json({
                    createMessage: "Add unsuccessful"
                })
            }

            return res.status(StatusCodes.CREATED).json({
                createMessage: "Add members successfully"
            })
        } catch (err) {
            return next(err);
        }
    };
}


module.exports = new MemberController();