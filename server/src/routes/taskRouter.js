const express = require('express');
const router = express.Router();

const taskValidator = require('../validations/taskValidator');
const JWTMiddleware = require('../middleware/JWTMiddleware');
const taskController = require('../controller/taskController');

const { upload } = require('../middleware/saveFile');
const { UserRoles } = require('../constants/usersConstant');

router.get('/list',
    [
        taskValidator.handlePagination,
        JWTMiddleware.verify([])
    ],
    taskController.listTaskByUser);


router.post('/create',
    [
        upload.array('file'),
        taskValidator.validateCreateTask,
        JWTMiddleware.verify([])
    ],
    taskController.create
);


router.get('/:taskId',
    [
        taskValidator.validateGetTask,
        JWTMiddleware.verify([])
    ],
    taskController.getTaskById
)


router.put('/assign/:taskId',
    [
        taskValidator.validateAssignTask,
        JWTMiddleware.verify([])
    ],
    taskController.assignTask
);


router.put('/admin/change-assignee/:taskId',
    [
        taskValidator.validateChangeAssignee,
        JWTMiddleware.verify([UserRoles.ADMIN])
    ],
    taskController.changeAssignee
);


router.put('/:taskId/update',
    [
        upload.array('file'),
        taskValidator.validateUpdateTask,
        JWTMiddleware.verify([])
    ],
    taskController.update
);


router.get('/admin/list',
    [
        JWTMiddleware.verify(["Admin"])
    ],
    taskController.listTaskByAdmin
)




module.exports = router;