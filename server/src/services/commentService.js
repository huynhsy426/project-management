const commentModel = require("../models/commentModel");

const { ErrorCodes } = require("../constants/errorConstant");
const userModel = require("../models/userModel");
const taskModel = require("../models/taskModel");


// Create comment 
const create = async (comment) => {
    const result = await commentModel.insertMany(comment);
    return result;
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

const getCommentById = async (commentId) => {
    const query = {
        _id: commentId
    }

    const comment = await commentModel.findOne(query)
        .populate(
            {
                path: 'userId',
                select: { "_id": 1, username: 1 }

            }
        )
        .populate({
            path: 'taskId',
            select: { "_id": 1, taskName: 1 }
        })
        .lean();

    if (!comment) {
        throw new Error(ErrorCodes.COMMENT_NOT_EXISTED);
    }
    return comment;
}

module.exports = {
    create: async ({ user, taskId, content }) => {
        await checkUserExist(user);
        await checkTaskExist(taskId);
        const result = await create({ userId: user.userId, taskId, content });
        return result[0];
    },

    getCommentByTaskId: async (taskId) => {
        await checkTaskExist(taskId);
        const comments = await getCommentByTaskId(taskId);
        return comments;
    },

    getCommentById: async (commentId) => {
        return getCommentById(commentId);
    }
}