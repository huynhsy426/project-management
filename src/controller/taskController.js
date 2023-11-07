const { StatusCodes } = require('http-status-codes');

const taskService = require("../services/taskService");
const { TaskStatus } = require("../constants/taskConstant");

module.exports = {
    create: async (req, res, next) => {
        const { taskName, assignee, content, point, deadlineAt } = JSON.parse(req.body.data);
        const attachments = req.files;
        const user = req.user;

        const newAttachments = attachments.map(attach => {
            return {
                path: attach.path,
                originalname: attach.originalname
            }
        })


        const taskEntity = {
            taskName: taskName,
            assignee: assignee,
            content: content,
            attachments: newAttachments,
            status: TaskStatus.TODO,
            point: point,
            createdBy: user.userId,
            deadlineAt: new Date(deadlineAt)
        }

        try {
            await taskService.create(taskEntity);
            res.status(StatusCodes.OK).json();
        } catch (err) {
            return next(err);
        }
    },

    listUnassignTask: async (req, res, next) => {
        try {
            const result = await taskService.listTasks();
            res.status(200).json({ result });
        } catch (err) {
            return next(err);
        }
    },

    assignTask: async (req, res, next) => {
        const user = req.user;
        const { taskId } = req.params;

        try {
            await taskService.assignTask(user.userId, taskId);
            res.status(StatusCodes.OK).json();
        } catch (error) {
            return next(error);
        }
    },

    /** pending */
    update: async (req, res, next) => {
        const user = req.user;
        const { taskName, content, status, point } = req.body;
        const { taskId } = req.params;
        const attachments = req.files;

        taskEntity = {
            taskName: taskName,
            attachments,
            content: content,
            status,
            point
        }

        try {
            await taskService.updateTask({ authorId: user.userId, taskId: taskId, taskEntity })
            res.status(StatusCodes.OK).json()
        } catch (error) {
            return next(error);
        }
    },


    changeAssignee: async (req, res, next) => {
        const { userId } = req.body;
        const { taskId } = req.params;
        const user = req.user;

        try {
            await taskService.changeAssignee({ authorId: user.userId, assigneeId: userId, taskId: taskId });
            res.status(StatusCodes.OK).json();
        } catch (error) {
            return next(error);
        }
    }
}