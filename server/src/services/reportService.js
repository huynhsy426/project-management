const taskModel = require('../models/taskModel');

const { TaskStatus } = require('../constants/taskConstant');


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


const caculateTimeOfTask = (tasks) => {

    // Phân loại các tasks
    const result = tasks.reduce((taskCheck, task) => {
        if (task.status === TaskStatus.DONE) {
            taskCheck.numDone++
            const start = new Date(task.createdAt).getTime();
            const end = new Date(task.updatedAt).getTime();
            const doneTime = (end - start) / (1000 * 60 * 60);

            taskCheck.doneTimes.push(doneTime);
            taskCheck.totalDoneTime += +doneTime;
            (doneTime >= taskCheck.timeLongest) && (taskCheck.timeLongest = doneTime);
        }

        task.status === TaskStatus.DOING && taskCheck.numPending++;
        task.status === TaskStatus.REJECTED && taskCheck.numDone++;

        return taskCheck;
    }, {
        numDone: 0,
        numPending: 0,
        numRejected: 0,
        totalDoneTime: 0,
        timeLongest: 0,
        timeShortest: 0,
        doneTimes: []
    })

    return result;
};


module.exports = {
    // Lấy dữ liệu từ DB lên xử lý
    // Kiểm tra trạng thái các task của User
    // Tính thời gian hoàn thành trung bình
    reportUser: async (user) => {
        const listTasksUserAssign = await getTaskUserAssign(user.userId);

        const {
            numDone,
            numPending,
            numRejected,
            totalDoneTime,
            timeLongest,
            doneTimes
        } = caculateTimeOfTask(listTasksUserAssign);
        const averageTime = numDone === 0 ? 0 : totalDoneTime / numDone;
        const timeShortest = numDone === 0 ? 0 : Math.min(Math.min(...doneTimes));

        return {
            numDone,
            numPending,
            numRejected,
            averageTime,
            timeLongest,
            timeShortest
        };
    }
}