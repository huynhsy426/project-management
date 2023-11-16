const mongoose = require('mongoose');
const taskModel = require('../models/taskModel');

const { ErrorCodes } = require("../constants/errorConstant");
const { TaskStatus } = require("../constants/taskConstant");
const projectModel = require('../models/projectModel');
const deptModel = require('../models/deptModel');



const create = async (task) => {
    const [result] = await taskModel.insertMany(task);
    if (!result) {
        throw new Error(ErrorCodes.CREATE_TASK_FAILED);
    }
    return;
};


const checkTaskName = async (taskName) => {
    const query = {
        taskName: taskName
    };
    const result = await taskModel.findOne(query).lean();

    if (result) {
        throw new Error(ErrorCodes.TASK_NAME_EXISTS)
    }
    return;
};


const getTaskById = async (taskId) => {
    const query = {
        _id: taskId
    }
    const result = await taskModel.findOne(query).lean();
    if (!result) {
        throw new Error(ErrorCodes.TASK_NOT_EXIST)
    }
    return result;
};



const listTasks = async (user, page) => {
    let count = 0;
    const skip = (page.page - 1) * page.ITEMS_PER_PAGE;
    const queryDepts = {
        "members.memberId": user.userId
    }

    const depts = await deptModel.find(queryDepts, { _id: 1 });

    const queryProjects = {
        deptId: { $in: depts }
    }

    // Loc các project mà các dept đó đang làm 
    // Kiểm tra user đó có phải là leader của project đó hay không
    const projects = await projectModel.find(queryProjects, { _id: 1, leaderId: 1 });
    const projectGroup = projects.reduce((acc, project) => {
        if (project.leaderId === user.userId) {
            acc.leaders.push(project._id)
        }
        acc.listProjectIds.push(project._id);
        return acc;
    },
        {
            listProjectIds: [],
            leaders: []
        })

    let query = null;

    // Nếu là leader thì hiển thị tất cả task mà nó tham gia và task trong project mà làm Leader
    if (projectGroup.leaders.length > 0) {
        query = {
            $or: [
                {
                    projectId: { $in: projectGroup.leaders }
                },
                {
                    projectId: { $in: projectGroup.listProjectIds },
                    $or: [{ assignee: user.userId }, { assignee: { $exists: false } }]
                }
            ]
        }
    }


    // Hiển thị list 
    if (page.taskType === "a") {
        query = {
            projectId: { $in: projectGroup.listProjectIds },
            assignee: user.userId
        }
    }
    else if (page.taskType === "na") {
        query = {
            projectId: { $in: projectGroup.listProjectIds },
            assignee: { $exists: false }
        }
    } else {
        query = {
            1: 1
        }
    }
    console.log({ query }, query.projectId)

    count = await taskModel.countDocuments(query);
    console.log({ count })
    const result = await taskModel.find(
        query,
        { taskName: 1, assignee: 1, content: 1, attachments: 1, status: 1, point: 1, create: 1, _id: 0, projectId: 1 }
    ).limit(page.ITEMS_PER_PAGE).skip(skip);
    const pageCount = count / page.ITEMS_PER_PAGE;
    console.log({ pageCount });
    return {
        pagination: {
            count,
            pageCount: Math.ceil(pageCount)
        },
        tasks: result
    };
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
                updatedAt: Date.now(),
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


const buildTaskVersion = ({ userId, task, newVersion }) => {
    const version = {
        changeBy: userId,
        updatedAt: Date.now(),
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


const checkTaskForUpdate = async (task, taskEntity) => {
    const taskUpdate = {};
    for (const key in taskEntity) {
        if (taskEntity[key]) {
            taskUpdate[key] = taskEntity[key];
        }
    }

    if (taskUpdate.status === 'done') {
        taskUpdate.point = 0
    }
    checkStatusOfTask(task);

    if (taskUpdate.taskName) {
        await checkTaskName(task.taskName);
    }

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
        throw new Error(ErrorCodes.CANNOT_CHANGE_USER)
    }
    return;
};


const checkStatusOfTask = (task) => {
    if (task.status === TaskStatus.DONE) {
        throw new Error(ErrorCodes.TASK_DONE)
    }
    if (task.status === TaskStatus.REJECTED) {
        throw new Error(ErrorCodes.TASK_REJECTED);
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
};


const checkUserInProject = async (projectId, userId) => {
    const queryProject = {
        _id: projectId
    }
    const project = await projectModel.findOne(queryProject, { deptId: 1 }).lean();

    const queryDept = {
        _id: project.deptId,
        "members.memberId": userId
    }
    const listUserParticipate = await deptModel.findOne(queryDept, { "members": 1 }).lean();

    if (!listUserParticipate) {
        throw new Error(ErrorCodes.USER_NOT_IN_PROJECT);
    }
}


module.exports = {
    create: async (task) => {
        await checkTaskName(task.taskName);
        await checkUserInProject(task.projectId, task.createdBy);
        if (task.assignee) {
            await checkUserInProject(task.projectId, task.assignee.userId);
        }
        await create(task);
    },

    // Done
    listTasks: (user, page) => {
        return listTasks(user, page);
    },


    // Done
    assignTask: async (userId, taskId) => {
        const task = await getTaskById(taskId);
        await checkUserInProject(task.projectId, userId);
        checkStatusOfTask(task);
        if (task.assignee) {
            throw new Error(ErrorCodes.TASK_HAS_ASSIGNED);
        }
        await assignTask(userId, task);
    },

    // choose field want to update
    // Check Data of taskName 
    // udate field 
    // Update version
    updateTask: async ({ authorId, taskId, taskEntity }) => {
        const task = await getTaskById(taskId);
        await checkUserInProject(task.projectId, authorId);
        const taskEntityUpdate = await checkTaskForUpdate(task, taskEntity);
        const version = buildTaskVersion({ userId: authorId, task, newVersion: taskEntityUpdate });
        await taskUpdate({ taskId, newVersion: version, taskEntityUpdate });
    },



    changeAssignee: async ({ authorId, assigneeId, taskId }) => {
        const result = await getTaskById(taskId);
        await checkUserInProject(task.projectId, authorId);
        checkStatusOfTask(result);
        await checkUserInProject(task.projectId, assigneeId);
        if (!result.assignee) {
            await assignTask(assigneeId, result);
            return;
        }
        const newVersion = {
            assignee: assigneeId,
            content: `Admin ${authorId} change ${taskId} task to ${assigneeId}`,
        }
        const version = buildTaskVersion({ userId: authorId, task: result, newVersion });

        await changeTaskAssignee({ assigneeId, taskId, newVersion: version });
    }
}