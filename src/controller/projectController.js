const ProjectService = require("../services/projectService")
const { StatusCodes } = require('http-status-codes');

module.exports = {
    listProject: async (req, res, next) => {
        try {
            const result = await ProjectService.listProject();
            return res.status(StatusCodes.OK).json({
                result
            })
        } catch (err) {
            return next(err);
        }
    },

    create: async (req, res, next) => {

    },




}