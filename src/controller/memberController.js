const { StatusCodes } = require('http-status-codes');

const MemberService = require('../services/memberService');



module.exports = {
    listMembersToJoin: (req, res, next) => {
        const deptId = req.params.deptId;
    },


    // Check validate first in middleware
    // Check members input isBlocked or in dept
    // Valid -> Add members to the dept
    addMembers: async (req, res, next) => {
        const members = req.body.members;
        const deptId = req.params.deptId;

        try {
            await MemberService.checkMemberInDeptOrIsBlock(members, deptId);

            const result = await MemberService.addMembersToDept({ deptId, members });
            console.log(result);
            if (!result || result.length === 0) {
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
    },


    deleteMember: async (req, res, next) => {
        const { memberId } = req.body;
        const { deptId } = req.params;


        try {
            await MemberService.delete(memberId, deptId)
            return res.status(StatusCodes.OK).json({
                message: "Deleted successfully"
            })
        } catch (error) {
            return next(error);
        }


    }
}