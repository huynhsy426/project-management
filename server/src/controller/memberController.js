const { StatusCodes } = require('http-status-codes');

const DeptService = require("../services/deptService");


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
            console.log("herer")
            const result = await DeptService.addMemberToDept(members, deptId);
            if (!result || result.length === 0) {
                return res.status(StatusCodes.CREATED).json({
                    createMessage: "Add failed"
                })
            }
            return res.status(StatusCodes.OK).json();
        } catch (err) {
            return next(err);
        }
    },


    deleteMember: async (req, res, next) => {
        const { memberId } = req.body;
        const { deptId } = req.params;


        try {
            await DeptService.removeMember(memberId, deptId)
            return res.status(StatusCodes.OK).json({
                message: "Deleted successfully"
            })
        } catch (error) {
            return next(error);
        }


    }
}