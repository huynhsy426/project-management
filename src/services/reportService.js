const mongoose = require('mongoose');
const taskModel = require('../models/taskModel');
const userModel = require('../models/userModel');


const TASK_STATUS = {
    DOING: "doing",
    REJECTED: "rejected",
    DONE: "done"
}


const getTaskUserAssign = async (userId) => {
    const query = {
        assignee: userId
    }
    const result = await taskModel.find(
        query,
        { versions: 0 }
    );
    return result;
}


const checkTaskStatus = (tasks) => {

    // Phân loại các tasks
    const constTasksBy = tasks.reduce((taskStatus, task) => {
        // taskStatus[task.status].push(task)
        if (task.status === TASK_STATUS.DOING) {
            taskStatus.doingTasks.push(task);
        }
        if (task.status === TASK_STATUS.REJECTED) {
            taskStatus.rejectedTasks.push(task);
        }
        if (task.status === TASK_STATUS.DONE) {
            taskStatus.doneTasks.push(task);
        }
        return taskStatus;
    }, {
        doneTasks: [],
        doingTasks: [],
        rejectedTasks: []
    })

    return {
        doneTasks: {
            doneTasks: constTasksBy.doneTasks,
            number: constTasksBy.doneTasks.length
        },
        doingTasks: {
            doingTasks: constTasksBy.doingTasks,
            number: constTasksBy.doingTasks.length
        },
        rejectedTasks: {
            rejectedTasks: constTasksBy.rejectedTasks,
            number: constTasksBy.rejectedTasks.length
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
        const listTasksUserAssign = await getTaskUserAssign(user.userId.trim());
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
    }
}