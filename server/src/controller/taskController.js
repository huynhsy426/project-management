const { StatusCodes } = require('http-status-codes');
const fse = require('fs-extra');

const taskService = require("../services/taskService");
const { TaskStatus } = require("../constants/taskConstant");

module.exports = {
    create: async (req, res, next) => {
        const { taskName, assignee, content, point, deadlineAt, projectId } = req.body;
        const attachments = req.files;
        const user = req.user;


        console.log({ attachments });

        const newAttachments = attachments.map(attach => {
            return {
                path: attach.path,
                originalname: attach.originalname,
                size: attach.size
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
            projectId,
            deadlineAt: new Date(deadlineAt)
        }

        try {
            await taskService.create(taskEntity);
            res.status(StatusCodes.OK).json();
        } catch (err) {
            for (const item of attachments) {
                const file = item.path;
                await fse.remove(file);
            }
            return next(err);
        }
    },
    getTaskById: async (req, res, next) => {
        try {
            const taskId = req.params.taskId;
            const task = await taskService.getTask(taskId);
            res.status(StatusCodes.OK).json({ task });
        } catch (error) {
            return next(error);
        }
    },

    // HIển thị task theo user 
    // Kiểm tra user đó có phải leader của project hay không nếu  có hiển thị tất cả task của project 
    // Nếu không thì hiển thị các task trong project chưa được assign 
    listTaskByUser: async (req, res, next) => {
        try {
            const user = req.user;
            const page = req.query.page || 1;
            const ITEMS_PER_PAGE = req.query.ITEMS_PER_PAGE || 2;
            const taskType = req.query.taskType;
            const pageInfor = {
                page,
                ITEMS_PER_PAGE,
                taskType
            }
            const result = await taskService.listTasks(user, pageInfor);
            console.log({ pa: result })
            res.status(200).json({ result });
        } catch (err) {
            return next(err);
        }
    },

    assignTask: async (req, res, next) => {
        const user = req.user;
        const { taskId } = req.params;

        console.log({ user, taskId })
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