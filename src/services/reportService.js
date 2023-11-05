const mongoose = require('mongoose');
const taskModel = require('../models/taskModel');
const userModel = require('../models/userModel');


const getTaskById = async (taskId) => {
    try {
        const query = {
            _id: taskId
        }
        const result = await taskModel.findOne(query);
        if (!result) {
            throw new Error("TASK_NOT_EXIST")
        }
        return result;
    } catch (error) {
        throw error;
    }
};


const getTaskUserAssign = async (userId) => {
    try {
        const query = {
            assignee: userId
        }
        const result = await taskModel.find(
            query,
            { versions: 0 }
        );
        return result;
    } catch (error) {
        throw error;
    }
}


const checkTaskStatus = (tasks) => {

    // Phân loại các tasks
    const doneTasks = tasks.filter(task => task.status === 'done');
    const doingTasks = tasks.filter(task => task.status === 'doing');
    const rejectedTasks = tasks.filter(task => task.status === 'rejected');

    return {
        doneTasks: {
            doneTasks,
            number: doneTasks.length
        },
        doingTasks: {
            doingTasks,
            number: doingTasks.length
        },
        rejectedTasks: {
            rejectedTasks,
            number: rejectedTasks.length
        }
    }
};


const calculateAverageCompletionTime = (completionTimes) => {
    // Calculate average time
    const averageCompletionTime = completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length;
    return averageCompletionTime;
};


const calculateLongestTimeTask = (tasks, completionTimes) => {
    // Take longest time in doneTask
    const longestTaskTime = Math.max(...completionTimes);

    // Find longest time
    const longestTask = tasks.doneTasks.find(task => {
        const start = new Date(task.createdAt).getTime();
        const end = new Date(task.updatedAt).getTime();
        const duration = (end - start) / (1000 * 60 * 60);
        return duration === longestTaskTime;
    });

    return { longestTask, time: longestTaskTime };
}


const calculateShortestTimeTask = (tasks, completionTimes) => {
    // Take shortest time in doneTask
    const shortestTaskTime = Math.min(...completionTimes);

    // Find shortest time
    const shortestTask = tasks.doneTasks.find(task => {
        const start = new Date(task.createdAt).getTime();
        const end = new Date(task.updatedAt).getTime();
        const duration = (end - start) / (1000 * 60 * 60);
        return duration === shortestTaskTime;
    });

    return { shortestTask, time: shortestTaskTime };
}


module.exports = {
    // Lấy dữ liệu từ DB lên xử lý
    // Kiểm tra trạng thái các task của User
    // Tính thời gian hoàn thành trung bình
    reportUser: async (user) => {
        try {
            const listTasksUserAssign = await getTaskUserAssign(user.userId);
            const reportTasks = checkTaskStatus(listTasksUserAssign);

            // Check time of done task
            const completionTimes = reportTasks.doneTasks.doneTasks.map(task => {
                const start = new Date(task.createdAt).getTime();
                const end = new Date(task.updatedAt).getTime();
                return (end - start) / (1000 * 60 * 60); // Tính bằng giờ
            });
            const averageTime = calculateAverageCompletionTime(completionTimes);
            const longestTaskTime = calculateLongestTimeTask(reportTasks.doneTasks, completionTimes);
            const shortestTaskTime = calculateShortestTimeTask(reportTasks.doneTasks, completionTimes);

            return {
                reportTasks,
                averageTime,
                longestTaskTime,
                shortestTaskTime
            };
        } catch (err) {
            throw err;
        }
    }
}