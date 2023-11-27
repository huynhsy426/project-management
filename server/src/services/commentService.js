const commentModel = require("../models/commentModel");

const { ErrorCodes } = require("../constants/errorConstant");
const userModel = require("../models/userModel");
const taskModel = require("../models/taskModel");


// Create comment 
const create = async (comment) => {
    await commentModel.insertMany(comment);
    return;
}

const checkUserExist = async (user) => {
    const query = {
        _id: user.userId
    }
    const isExistUser = await userModel.findOne(
        query,
        { _id: 1 }
    ).lean()

    if (!isExistUser) {
        throw new Error(ErrorCodes.USER_NOT_EXIST)
    }
    return;
}

const checkTaskExist = async (taskId) => {
    const query = {
        _id: taskId
    }
    const isTaskExist = await taskModel.findOne(
        query,
        { _id: 1 }
    ).lean()

    if (!isTaskExist) {
        throw new Error(ErrorCodes.TASK_NOT_EXIST)
    }
    return;
}


const getCommentByTaskId = async (taskId) => {
    const query = {
        taskId: taskId
    }
    const comments = await commentModel.find(query)
        .populate(
            {
                path: 'userId',
                select: { "_id": 1, username: 1 }

            }
        )
        .populate({
            path: 'taskId',
            select: { "_id": 1, taskName: 1 }
        });

    return comments;
}



module.exports = {
    create: async ({ user, taskId, content }) => {
        await checkUserExist(user);
        await checkTaskExist(taskId);
        await create({ userId: user.userId, taskId, content });
    },

    getCommentByTaskId: async (taskId) => {
        await checkTaskExist(taskId);
        const comments = await getCommentByTaskId(taskId);
        return comments;
    }
}