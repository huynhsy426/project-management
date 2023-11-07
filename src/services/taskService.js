const mongoose = require('mongoose');
const taskModel = require('../models/taskModel');
const userModel = require('../models/userModel');

const TaskStatus = {
    DOING: "doing",
    REJECTED: "rejected",
    DONE: "done"
}



const create = async (task) => {
    const [result] = await taskModel.insertMany(task);
    if (!result) {
        throw new Error("CREATE_TASK_FAILED");
    }
    return;
};


const checkTaskName = async (taskName) => {
    const query = {
        taskName: taskName
    };
    const result = await taskModel.findOne(query).lean();

    if (result) {
        throw new Error("TASK_NAME_EXISTS")
    }
    return;
};


const getTaskById = async (taskId) => {
    const query = {
        _id: taskId
    }
    const result = await taskModel.findOne(query).lean();
    if (!result) {
        throw new Error("TASK_NOT_EXIST")
    }
    return result;
};



const listTasks = async () => {
    const query = {
        assignee: { $exists: false }
    }
    const result = await taskModel.find(
        query,
        { taskName: 1, assignee: 1, content: 1, attachments: 1, status: 1, point: 1, create: 1, _id: 0 }
    );
    return result;
};


const assignTask = async (userId, task) => {
    const query = {
        _id: task._id
    }
    const update = {
        $set: {
            assignee: (userId),
            status: TaskStatus.DOING
        },
        $push: {
            versions: {
                changeBy: userId,
                updated_at: Date.now(),
                new: {
                    taskName: task.taskName,
                    assignee: (userId),
                    content: `${userId} user asigned task`,
                    attachments: task.attachments,
                    status: TaskStatus.DOING,
                    point: task.point,
                    deadlineAt: task.deadlineAt
                }
            }
        }

    }

    await taskModel.updateOne(query, update);
    return;
};


const checkUserExist = async (userId) => {
    const query = {
        _id: userId
    }
    const result = await userModel.findOne(
        query,
        { _id: 1 }
    ).lean();

    if (!result) {
        throw new Error('USER_NOT_EXIST');
    }
    return result
};


const buildTaskVersion = ({ userId, task, newVersion }) => {
    const version = {
        changeBy: userId,
        updated_at: Date.now(),
        old: {
            ...task.versions[task.versions.length - 1].new
        },
        new: {
            taskName: newVersion?.taskName ?? task.taskName,
            assignee: newVersion?.assignee ?? task.assignee,
            content: newVersion?.content ?? task.content,
            attachments: newVersion?.attachments ?? task.attachments,
            status: newVersion?.status ?? task.status,
            point: newVersion?.point ?? task.point,
            deadlineAt: newVersion?.deadlineAt ?? task.deadlineAt
        }
    }
    return version;
};


const checkTaskForUpdate = (task, taskEntity) => {
    const taskUpdate = {};
    for (const key in taskEntity) {
        if (taskEntity[key]) {
            taskUpdate[key] = taskEntity[key];
        }
    }
    checkStatusOfTask(task);
    return taskUpdate;
}


const changeTaskAssignee = async ({ assigneeId, taskId, newVersion }) => {
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
};


const checkStatusOfTask = (task) => {
    if (task.status === TaskStatus.DONE) {
        throw new Error("TASK_DONE")
    }
    if (task.status === TaskStatus.REJECTED) {
        throw new Error("TASK_REJECTED");
    }
    return;
}


const taskUpdate = async ({ taskId, newVersion, taskEntityUpdate }) => {
    const query = {
        _id: taskId
    };

    const update = {
        $set: taskEntityUpdate,
        $push: {
            versions: newVersion
        }
    };

    await taskModel.updateOne(query, update)
    return;
}


module.exports = {
    create: async (task) => {
        await checkTaskName(task.taskName);
        if (task.assignee) {
            await checkUserExist(task.assignee.userId);
        }
        await create(task);
    },

    // Done
    listTasks,


    // Done
    assignTask: async (userId, taskId) => {
        const result = await getTaskById(taskId);
        checkStatusOfTask(result);
        if (result.assignee) {
            throw new Error("TASK_HAS_ASSIGNED")
        }
        await assignTask(userId, result);
    },

    // choose field want to update
    // Check Data of taskName 
    // udate field 
    // Update version
    updateTask: async ({ authorId, taskId, taskEntity }) => {
        const result = await getTaskById(taskId);
        const taskEntityUpdate = checkTaskForUpdate(result, taskEntity);
        const version = buildTaskVersion({ userId: authorId, task: result, newVersion: taskEntity });

        // console.log({ version });
        await taskUpdate({ taskId, newVersion: version, taskEntityUpdate });
    },



    changeAssignee: async ({ authorId, assigneeId, taskId }) => {
        try {
            const result = await getTaskById(taskId);
            checkStatusOfTask(result);
            await checkUserExist(assigneeId);
            if (!result.assignee) {
                await assignTask(assigneeId, result);
                return;
            }

            const newVersion = {
                assignee: new mongoose.Types.ObjectId(assigneeId),
                content: `Admin ${authorId} change ${taskId} task to ${assigneeId}`,
            }
            const version = buildTaskVersion({ userId: authorId, task: result, newVersion });

            await changeTaskAssignee({ assigneeId, taskId, newVersion: version });
        } catch (err) {
            throw err;
        }
    }
}