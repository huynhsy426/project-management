const { default: mongoose } = require('mongoose');
const taskModel = require('../models/taskModel');
const userModel = require('../models/userModel');

const create = async (task) => {
    console.log({ task })
    try {
        const [result] = await taskModel.insertMany(task);
        if (result === null) {
            throw new Error("CREATE_TASK_FAILED");
        }
        return;
    } catch (err) {
        throw err;
    }
};


const checkTaskName = async (taskName) => {
    try {
        const query = {
            taskName: taskName
        };
        const result = await taskModel.findOne(query);

        if (result !== null) {
            throw new Error("TASK_NAME_EXISTS")
        }
        return;
    } catch (err) {
        throw err;
    }
};


const listTasks = async () => {
    try {
        const query = {
            assignee: {}
        }
        const result = await taskModel.find(
            query,
            { taskName: 1, assignee: 1, content: 1, attachments: 1, status: 1, point: 1, create: 1, _id: 0 }
        );
        console.log({ result })
        return result;
    } catch (error) {
        throw error;
    }
};


const assignTask = async (userId, taskId) => {
    try {
        const query = {
            _id: taskId
        }
        const update = {
            $set: {
                assignee: {
                    userId: new mongoose.Types.ObjectId(userId)
                }
            }
        }
        await taskModel.updateOne(query, update);
        return;
    } catch (error) {
        throw error;
    }
};


const checkUserExist = async (userId) => {
    try {
        const query = {
            _id: userId
        }
        const result = await userModel.findOne(
            query,
            { 1: 1 }
        )
        if (result === null) {
            throw new Error('USER_NOT_EXIST');
        }
        return
    } catch (error) {
        throw error;
    }
};


const checkUserIsAssignTask = async (userId, taskId) => {
    try {
        const query = {
            _id: taskId,
            "assignee.userId": userId
        }
        const result = await taskModel.findOne(
            query,
            { 1: 1 }
        )
        if (result !== null) {
            throw new Error("USER_HAS_ASSIGNED")
        }
        return;
    } catch (error) {
        throw error;
    };
}


module.exports = {
    create: async (task) => {
        try {
            console.log("herkjaskdjn")
            await checkTaskName(task.taskName);
            await create(task);
        } catch (e) {
            throw e;
        }
    },

    listTasks: () => {
        return listTasks();
    },

    assignTask: async (userId, taskId) => {
        try {
            await checkUserExist(userId);
            await checkUserIsAssignTask(userId, taskId);
            await assignTask(userId, taskId);
        } catch (err) {
            throw err;
        }
    },

    updateTask: async () => {

    }
}