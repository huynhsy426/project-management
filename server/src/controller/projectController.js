const ProjectService = require("../services/projectService");
const { StatusCodes } = require('http-status-codes');

const ITEMS_PER_PAGE = 1;

module.exports = {
    listProjectByRoles: async (req, res, next) => {
        const user = req.user;
        const page = req.query.page || 1;
        const ITEMS_PER_PAGE = req.query.page || 2;
        const pagi = {
            page,
            ITEMS_PER_PAGE
        }
        try {
            const { pagination, result } = await ProjectService.listProjectByRoles(user, pagi);
            return res.status(StatusCodes.OK).json({ pagination, result });
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
            projectName: projectName,
            deptId: deptId,
            insTm: today,
            updTm: null,
            version: 1,
            leaderId: leaderId,
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