const { StatusCodes } = require('http-status-codes');

const taskService = require("../services/taskService");

module.exports = {
    create: async (req, res, next) => {
        const { taskName, assignee, content, status, point } = JSON.parse(req.body.data);
        const attachments = req.files;
        const user = req.user;


        const today = new Date();

        let version = 0;
        (JSON.stringify(assignee) !== '{}')
            ? version = 1
            : version = 0;

        const newAttachments = attachments.map(attach => {
            return {
                path: attach.path,
                originalname: attach.originalname
            }
        })

        const taskEntity = {
            taskName,
            assignee: assignee,
            content,
            attachments: newAttachments,
            status,
            point,
            create: {
                userId: user.userId,
                createAt: today
            },
            version: {
                userId: user.userId,
                version,
                updateTime: today,
                content: content
            }
        }

        try {
            await taskService.create(taskEntity);
            res.status(StatusCodes.OK).json();
        } catch (err) {
            return next(err);
        }
    },

    listTask: async (req, res, next) => {
        try {
            const result = await taskService.listTasks();
            res.status(200).json({ result });
        } catch (err) {
            return next(err);
        }
    },

    assignTask: async (req, res, next) => {
        const user = req.user;
        const { assignee } = req.body;
        const { taskId } = req.params;

        try {
            assignee.userId !== null
                ? await taskService.assignTask(assignee.userId, taskId)
                : await taskService.assignTask(user.id, taskId);
            res.status(StatusCodes.OK).json();
        } catch (error) {
            return next(error);
        }
    },


    update: async (req, res, next) => {

    }
}