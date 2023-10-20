const ProjectService = require("../services/projectService");
const mongoTest = require("../models/mongoTest");
const { StatusCodes } = require('http-status-codes');

module.exports = {
    listProjectByRoles: async (req, res, next) => {
        const { roles, userId } = req.user;
        try {
            const result = await ProjectService.listProjectByRoles(roles, userId);
            return res.status(StatusCodes.OK).json({
                result
            })
        } catch (err) {
            return next(err);
        }
    },


    list: async (req, res, next) => {
        console.log("here")
        const result = await mongoTest.list();
        return res.json({
            result
        });
    },


    create: async (req, res, next) => {

        const { minExp } = req.params;
        const { deptId, projectName, leaderId } = req.body;

        const today = new Date();
        const getToDay = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`

        const projectEntity = {
            projectId: '',
            projectName,
            deptId,
            insTm: getToDay,
            updTm: null,
            version: 1,
            leaderId,
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