const { StatusCodes } = require('http-status-codes');

const taskService = require("../services/taskService");

module.exports = {
    create: async (req, res, next) => {
        const { taskName, assignee, content, point, deadlineAt } = JSON.parse(req.body.data);
        const attachments = req.files;
        const user = req.user;

        const newAttachments = attachments.map(attach => {
            return {
                path: attach.path.trim(),
                originalname: attach.originalname.trim()
            }
        })


        const taskEntity = {
            taskName: taskName.trim(),
            assignee: assignee.trim(),
            content: content.trim(),
            attachments: newAttachments,
            status: "todo",
            point: point.trim(),
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
            await taskService.assignTask(user.userId, taskId.trim());
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
            taskName: taskName.trim(),
            attachments,
            content: content.trim(),
            status,
            point
        }

        console.log({ taskEntity });

        try {
            await taskService.updateTask({ authorId: user.userId, taskId: taskId.trim(), taskEntity })
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
            await taskService.changeAssignee({ authorId: user.userId, assigneeId: userId.trim(), taskId: taskId.trim() });
            res.status(StatusCodes.OK).json();
        } catch (error) {
            return next(error);
        }
    }
}