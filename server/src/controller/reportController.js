const { StatusCodes } = require('http-status-codes');

const reportService = require('../services/reportService');

module.exports = {
    reportUser: async (req, res, next) => {
        const user = req.user;
        const page = req.params.page || 1;

        try {
            const {
                numDone,
                numPending,
                numRejected,
                averageTime,
                timeLongest,
                timeShortest
            } = await reportService.reportUser(user)
            res.status(StatusCodes.OK).json({
                numDone,
                numPending,
                numRejected,
                averageTime,
                timeLongest,
                timeShortest
            });
        } catch (err) {
            return next(err);
        }
    }
}