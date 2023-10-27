const { StatusCodes } = require('http-status-codes');

const DeptService = require("../services/deptService");
const MemberService = require("../services/memberService");

module.exports = {
    // List dept by roles of user
    listDeptsByRoles: async (req, res, next) => {
        const { userId, roles } = req.user;
        try {
            const listDeptsByUser = await DeptService.listDeptsByRoles(userId, roles);
            return res.status(StatusCodes.OK).json({
                listDept: listDeptsByUser
            })
        } catch (err) {
            return next(err);
        }
    },

    // Validate du lieu
    // Check member block thi khong cho phep add vao phong ban
    // Check member da trung thi khong cho add them vao
    createDept: async (req, res, next) => {
        const { members, deptName } = req.body;
        const { userId } = req.user;

        const deptEntity = {
            deptId: '',
            deptName: deptName,
            authorId: userId,
            members
        }

        console.log({ deptEntity })

        try {
            // Check members of listSelect
            await DeptService.checkMemberIsBlockAndRoles(deptEntity.members);

            // Check members is exist
            await DeptService.checkMembersIsExist(deptEntity.members);

            // Check dept before create
            await DeptService.createDept(deptEntity);
            return res.status(StatusCodes.CREATED).json({
                createMessage: "Create Dept successfully"
            })
        } catch (err) {
            return next(err);
        }
    },



    searchDept: async (req, res, next) => {
        const { deptName } = req.params;
        try {
            const searchResult = await DeptService.searchDept(deptName);
            return res.status(StatusCodes.OK).json({
                deptList: searchResult
            })
        } catch (error) {
            return next(error);
        }
    },


    deleteById: async (req, res, next) => {
        const { deptId } = req.params;
        try {
            const result = await DeptService.deleteById(deptId);
            if (!result) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: "delete failed!!!"
                })
            }
            return res.status(StatusCodes.OK)
        } catch (err) {
            return next(err);
        }
    },


    // Update by dept Id 
    // Just update name
    updateById: async (req, res, next) => {
        const deptId = req.params.deptId;
        const deptName = req.body.deptName;

        try {
            const isUpdate = await DeptService.updateById(deptId, deptName);
            if (!isUpdate) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    errMessage: "Dept Id not found."
                })
            }
            return res.status(StatusCodes.OK).json();
        } catch (err) {
            return next(err);
        }
    }
}
