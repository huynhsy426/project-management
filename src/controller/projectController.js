const ProjectService = require("../services/projectService");
const { StatusCodes } = require('http-status-codes');

module.exports = {
    listProjectByRoles: async (req, res, next) => {
        const { roles, userId } = req.user;
        try {
            const result = await ProjectService.listProjectByRoles(roles, userId.trim());
            return res.status(StatusCodes.OK).json({
                result
            })
        } catch (err) {
            return next(err);
        }
    },


    create: async (req, res, next) => {

        const { minExp } = req.params;
        const { deptId, projectName, leaderId } = req.body;

        const today = new Date();

        const projectEntity = {
            projectId: '',
            projectName: projectName.trim(),
            deptId: deptId.trim(),
            insTm: today,
            updTm: null,
            version: 1,
            leaderId: leaderId.trim(),
            minExp,
            completedAt: null
        }

        try {
            await ProjectService.create(projectEntity);
            res.status(StatusCodes.OK).json({
                message: "Create project successfully"
            })
        } catch (err) {
            return next(err);
        }
    }
}