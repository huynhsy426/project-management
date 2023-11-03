const { StatusCodes } = require('http-status-codes');

const reportService = require('../services/reportService');

module.exports = {
    reportUser: async (req, res, next) => {
        const user = req.user;

        try {
            const { reportNumber, averageTime } = await reportService.reportUser(user)
            res.status(StatusCodes.OK).json({
                reportNumber, averageTime
            });
        } catch (err) {
            return next(err);
        }
    }
}