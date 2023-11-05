const mongoose = require('mongoose');
const taskModel = require('../models/taskModel');
const userModel = require('../models/userModel');

const create = async (task) => {
    try {
        const [result] = await taskModel.insertMany(task);
        if (!result) {
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

        if (result) {
            throw new Error("TASK_NAME_EXISTS")
        }
        return;
    } catch (err) {
        throw err;
    }
};


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



const listTasks = async () => {
    try {
        const query = {
            assignee: { $exists: false }
        }
        const result = await taskModel.find(
            query,
            { taskName: 1, assignee: 1, content: 1, attachments: 1, status: 1, point: 1, create: 1, _id: 0 }
        );
        return result;
    } catch (error) {
        throw error;
    }
};


const assignTask = async (userId, task) => {
    try {
        const query = {
            _id: task._id
        }
        const update = {
            $set: {
                assignee: new mongoose.Types.ObjectId(userId),
                status: 'doing'
            },
            $push: {
                versions: {
                    changeBy: userId,
                    updated_at: Date.now(),
                    new: {
                        taskName: task.taskName,
                        assignee: new mongoose.Types.ObjectId(userId),
                        content: `${userId} user asigned task`,
                        attachments: task.attachments,
                        status: 'doing',
                        point: task.point,
                        deadlineAt: task.deadlineAt
                    }
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
        if (!result) {
            throw new Error('USER_NOT_EXIST');
        }
        return result
    } catch (error) {
        throw error;
    }
};


const buildTaskVersion = (userId, task) => {
    const version = {
        changeBy: userId,
        updated_at: Date.now(),
        old: {
            ...task.versions[task.versions.length - 1].new
        }
    }
    return version;
};


const checkTaskForUpdate = (task, taskEntity) => {
    const taskUpdate = {};
    for (const key in taskEntity) {
        if (taskEntity[key] !== undefined) {
            taskUpdate[key] = taskEntity[key];
        }
    }
    checkStatusOfTask(task);
    return taskUpdate;
}


const changeTaskAssignee = async ({ assigneeId, taskId, newVersion }) => {
    try {
        const query = {
            _id: taskId
        };

        const update = {
            assignee: new mongoose.Types.ObjectId(assigneeId),
            $push: {
                versions: newVersion
            }
        }
        const result = await taskModel.updateOne(query, update);
        if (result.modifiedCount === 0) {
            throw new Error("CANNOT_CHANGE_USER")
        }
        return;
    } catch (error) {
        throw error;
    }
};


const checkStatusOfTask = (task) => {
    if (task.status === "done") {
        throw new Error("TASK_DONE")
    }
    else if (task.status === "rejected") {
        throw new Error("TASK_REJECTED");
    }
    return;
}


const taskUpdate = async ({ taskId, newVersion, taskEntityUpdate }) => {
    try {
        const query = {
            _id: taskId
        };

        console.log({ newVersion, taskEntityUpdate })

        const update = {
            $set: taskEntityUpdate,
            $push: {
                versions: newVersion
            }
        };

        await taskModel.updateOne(query, update)
        return;
    } catch (err) {
        throw err;
    }
}


module.exports = {
    create: async (task) => {
        try {
            await checkTaskName(task.taskName);
            if (task.assignee) {
                await checkUserExist(task.assignee.userId);
            }
            await create(task);
        } catch (e) {
            throw e;
        }
    },

    // Done
    listTasks: () => {
        return listTasks();
    },


    // Done
    assignTask: async (userId, taskId) => {
        try {
            const result = await getTaskById(taskId);
            checkStatusOfTask(result);
            if (result.assignee) {
                throw new Error("TASK_HAS_ASSIGNED")
            }
            await assignTask(userId, result);
        } catch (err) {
            throw err;
        }
    },

    // choose field want to update
    // Check Data of taskName 
    // udate field 
    // Update version
    updateTask: async ({ authorId, taskId, taskEntity }) => {
        try {
            const result = await getTaskById(taskId);
            const taskEntityUpdate = checkTaskForUpdate(result, taskEntity);
            const version = buildTaskVersion(authorId, result);
            version.new = {
                taskName: result.taskName,
                assignee: result.assignee,
                content: result.content,
                attachments: result.attachments,
                status: result.status,
                point: result.point,
                deadlineAt: result.deadlineAt
            }

            for (const key in taskEntityUpdate) {
                version.new[key] = taskEntity[key];
            }
            console.log({ version });
            await taskUpdate({ taskId, newVersion: version, taskEntityUpdate });
        } catch (err) {
            throw err;
        }
    },



    changeAssignee: async ({ authorId, assigneeId, taskId }) => {
        try {
            const result = await getTaskById(taskId);
            checkStatusOfTask(result);
            if (!result.assignee) {
                await assignTask(assigneeId, result);
                return;
            }
            await checkUserExist(assigneeId);
            const version = buildTaskVersion(authorId, result);
            version.new = {
                taskName: result.taskName,
                assignee: new mongoose.Types.ObjectId(assigneeId),
                content: `Admin ${authorId} change ${taskId} task to ${assigneeId}`,
                attachments: result.attachments,
                status: result.status,
                point: result.point,
                deadlineAt: result.deadlineAt
            }
            await changeTaskAssignee({ assigneeId, taskId, newVersion: version });
        } catch (err) {
            throw err;
        }
    }
}