const express = require('express');
const router = express.Router();

const TaskValidator = require('../validations/taskValidator');
const JWTMiddleware = require('../middleware/JWTMiddleware');
const taskController = require('../controller/taskController');

const { upload } = require('../middleware/saveFile');
const { UserRoles } = require('../constants/usersConstant');

router.get('/list',
    [
        TaskValidator.handlePagination,
        JWTMiddleware.verify([])
    ],
    taskController.listTaskByUser);


router.post('/create',
    [
        upload.array('file'),
        TaskValidator.validateCreateTask,
        JWTMiddleware.verify([])
    ],
    taskController.create
);


router.get('/:taskId',
    [
        TaskValidator.validateGetTask,
        JWTMiddleware.verify([])
    ],
    taskController.getTaskById
)


router.put('/assign/:taskId',
    [
        TaskValidator.validateAssignTask,
        JWTMiddleware.verify([])
    ],
    taskController.assignTask
);


router.put('/admin/change-assignee/:taskId',
    [
        TaskValidator.validateChangeAssignee,
        JWTMiddleware.verify([UserRoles.ADMIN])
    ],
    taskController.changeAssignee
);


router.put('/:taskId/update',
    [
        upload.array('file'),
        TaskValidator.validateUpdateTask,
        JWTMiddleware.verify([])
    ],
    taskController.update
);


router.get('/admin/list',
    [
        JWTMiddleware.verify([UserRoles.ADMIN])
    ],
    taskController.listTaskByAdmin
)




module.exports = router;