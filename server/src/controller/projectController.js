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

    getProjectById: async (req, res, next) => {
        try {
            const projectId = req.params.projectId;
            const project = await ProjectService.getProjectById(projectId);
            res.status(StatusCodes.OK).json({ project })
        } catch (error) {
            return next(error);
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
    },

    getTasksByProjectId: async (req, res, next) => {
        try {
            const projectId = req.params.projectId;
            const page = req.query.page || 1;
            const ITEMS_PER_PAGE = req.query.ITEMS_PER_PAGE || 2;
            const taskType = req.query.taskType;

            const pageInfor = {
                page,
                ITEMS_PER_PAGE,
                taskType
            }

            const tasks = await ProjectService.getTasksByProjectId(projectId, pageInfor);
            console.log({ tasks });
            res.status(StatusCodes.OK).json({ tasks })
        } catch (error) {
            return next(error);
        }
    }
}