const ProjectService = require("../services/projectService")
const { StatusCodes } = require('http-status-codes');

module.exports = {
    listProject: (req, res, next) => {
        ProjectService.listProject().
            then(result => {
                return res.status(StatusCodes.OK).json({
                    result
                })
            })
            .catch(err => {
                return next(err);
            })
    }




}