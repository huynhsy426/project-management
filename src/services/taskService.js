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


const taskIsExist = async (taskId) => {
    try {
        const query = {
            _id: taskId
        }
        const result = await taskModel.findOne(
            query, { 1: 1 }
        )
        if (!result) {
            throw new Error("TASK_NOT_EXIST")
        }
        return;
    } catch (err) {
        throw err;
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


const assignTask = async (userId, taskId) => {
    try {
        const query = {
            _id: taskId
        }
        const findTask = await taskModel.findOne(
            query,
            { _id: 0 }
        )

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
                        taskName: findTask.taskName,
                        assignee: new mongoose.Types.ObjectId(userId),
                        content: `${userId} user asigned task`,
                        attachments: findTask.attachments,
                        status: 'doing',
                        point: findTask.point
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


const buildTaskVersion = async (userId, taskId) => {
    try {
        const query = {
            _id: taskId
        }
        const findTask = await taskModel.findOne(
            query,
            { _id: 0 }
        )
        const version = {
            changeBy: userId,
            updated_at: Date.now(),
            old: {
                ...findTask.versions[findTask.versions.length - 1].new
            }
        }
        return { version, findTask };
    } catch (error) {
        throw error;
    }
};


const canAssignTask = async (taskId) => {
    try {
        const query = {
            _id: taskId,
            "assignee": { $exists: true }
        }
        const result = await taskModel.findOne(
            query,
            { 1: 1 }
        )

        return result;
    } catch (error) {
        throw error;
    }
};


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
        const result = await taskModel.updateOne(
            query, update
        )
        if (result.modifiedCount === 0) {
            throw new Error("CANNOT_CHANGE_USER")
        }
        return;
    } catch (error) {
        throw error;
    }
};


const checkTaskForUpdate = async (taskId, task) => {
    try {
        const taskEntity = {};
        for (const key in task) {
            if (task[key] !== undefined) {
                taskEntity[key] = task[key];
            }
        }
        await checkStatusOfTask(taskId);
        if (taskEntity.taskName) {
            await checkTaskName(taskEntity.taskName);
            return taskEntity;
        }
        return taskEntity;
    } catch (err) {
        throw err;
    }
};


const checkStatusOfTask = async (taskId) => {
    try {
        const query = {
            _id: taskId,
            $or: [{ status: "done" }, { status: "rejected" }]
        }
        const result = await taskModel.findOne(
            query, { status: 1, _id: 0 }
        )
        if (result) {
            if (result.status === "done") {
                throw new Error("TASK_DONE")
            }
            throw new Error("TASK_REJECTED");
        }
        return;
    } catch (err) {
        throw err;
    }
}


const taskUpdate = async ({ taskId, newVersion, taskEntityUpdate }) => {
    try {
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

    listTasks: () => {
        return listTasks();
    },

    assignTask: async (userId, taskId) => {
        try {
            await taskIsExist(taskId);
            await checkStatusOfTask(taskId);
            const canAssign = await canAssignTask(taskId);
            if (canAssign) {
                throw new Error("TASK_HAS_ASSIGNED")
            }
            await assignTask(userId, taskId);
        } catch (err) {
            throw err;
        }
    },

    //choose field want to update
    // Check Data of taskName 
    // udate field 
    // Update version
    updateTask: async ({ authorId, taskId, taskEntity }) => {
        try {
            const taskEntityUpdate = await checkTaskForUpdate(taskId, taskEntity);
            const { version, findTask } = await buildTaskVersion(authorId, taskId);

            version.new = {
                taskName: findTask.taskName,
                assignee: findTask.assignee,
                content: findTask.content,
                attachments: findTask.attachments,
                status: findTask.status,
                point: findTask.point,
                deadline: findTask.deadline
            }

            for (const key in taskEntityUpdate) {
                version.new[key] = taskEntityUpdate[key];
            }

            await taskUpdate({ taskId, newVersion: version, taskEntityUpdate });
        } catch (err) {
            throw err;
        }
    },


    changeAssignee: async ({ authorId, assigneeId, taskId }) => {
        try {
            const canAssign = await canAssignTask(taskId);
            if (canAssign) {
                await checkStatusOfTask(taskId);
                await checkUserExist(assigneeId);
                const { version, findTask } = await buildTaskVersion(authorId, taskId);
                version.new = {
                    taskName: findTask.taskName,
                    assignee: new mongoose.Types.ObjectId(assigneeId),
                    content: `Admin ${authorId} change ${taskId} task to ${assigneeId}`,
                    attachments: findTask.attachments,
                    status: findTask.status,
                    point: findTask.point,
                    deadline: findTask.deadline
                }
                await changeTaskAssignee({ assigneeId, taskId, newVersion: version });
            }
            await taskIsExist(taskId);
            await checkStatusOfTask(taskId);
            await assignTask(assigneeId, taskId);
        } catch (err) {
            throw err;
        }
    }
}