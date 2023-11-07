const { StatusCodes } = require('http-status-codes');

const deptService = require("../services/deptService");

module.exports = {
    // List dept by roles of user
    listDeptsByRoles: async (req, res, next) => {
        const { userId, roles } = req.user;
        try {
            const listDeptsByUser = await deptService.listDeptsByRoles(userId.trim(), roles.trim());
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
            deptName: deptName.trim(),
            authorId: userId.trim(),
            members
        }

        try {
            // Check members of listSelect
            await deptService.checkMemberIsBlockAndRoles(deptEntity.members);

            // Check members is exist
            await deptService.checkMembersIsExist(deptEntity.members);

            // Check dept before create
            await deptService.createDept(deptEntity);
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
            const searchResult = await deptService.searchDept(deptName.trim());
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
            const result = await deptService.deleteById(deptId.trim());
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
            const isUpdate = await deptService.updateById(deptId.trim(), deptName.trim());
            if (!isUpdate) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    errMessage: "Dept Id not found."
                })
            }
            return res.status(StatusCodes.OK).json();
        } catch (err) {
            return next(err);
        }
    },



}
