const express = require('express');
const router = express.Router();

const taskValidator = require('../validations/taskValidator');
const JWTMiddleware = require('../middleware/JWTMiddleware');
const taskController = require('../controller/taskController');

const multer = require('multer');

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


router.put('/admin/:taskId/update',
    [
        taskValidator.validateUpdateTask,
        // upload.array('file'),
        JWTMiddleware.verify([UserRoles.ADMIN])
    ],
    taskController.update
);




module.exports = router;