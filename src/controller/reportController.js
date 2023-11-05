const { StatusCodes } = require('http-status-codes');

const reportService = require('../services/reportService');

module.exports = {
    reportUser: async (req, res, next) => {
        const user = req.user;

        try {
            const { reportTasks, averageTime, longestTaskTime, shortestTaskTime } = await reportService.reportUser(user)
            res.status(StatusCodes.OK).json({
                reportTasks,
                averageTime,
                longestTaskTime,
                shortestTaskTime
            });
        } catch (err) {
            return next(err);
        }
    }
}