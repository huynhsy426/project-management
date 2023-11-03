const mongoose = require('mongoose');
const taskModel = require('../models/taskModel');
const userModel = require('../models/userModel');


const checkTaskStatus = async (userId) => {
    try {
        const report = {
            done: 0,
            rejected: 0,
            doing: 0
        }

        const query = {
            assignee: userId
        }

        const result = await taskModel.find(query, { _id: 0, status: 1 });

        for (const item of result) {
            if (item.status === "done") {
                report.done++;
            } else if (item.status === "rejected") {
                report.rejected++;
            } else if (item.status === "doing") {
                report.doing++;
            }
        }
        console.log({ report });
        return report;
    } catch (err) {
        throw err;
    }
};


const averageTimeOfUser = async (userId) => {
    try {
        const match = {
            assignee: userId,
            // status: 'done'
        }
        const project = {
            result: {
                $dateDiff: {
                    startDate: "$createdAt",
                    endDate: "$updatedAt",
                    unit: "day"
                }
            }
        }
        const result = await taskModel.aggregate(
            [
                { $match: match },
                { $project: project }
            ]
        );
        console.log({ result });
        return result;
    } catch (err) {
        throw err;
    }
};


module.exports = {
    reportUser: async (user) => {
        try {
            console.log(user.userId)
            const reportNumber = await checkTaskStatus(user.userId);
            const averageTime = await averageTimeOfUser(user.userId);
            return { reportNumber, averageTime };
        } catch (err) {
            throw err;
        }
    }
}