const express = require('express');
const router = express.Router();

const taskValidator = require('../validations/taskValidator');
const JWTMiddleware = require('../middleware/JWTMiddleware');
const taskController = require('../controller/taskController');

const upload = require('../middleware/saveFile');

router.get('/list', taskController.listUnassignTask);

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
        JWTMiddleware.verify(["Admin"])
    ],
    taskController.changeAssignee
);


router.put('/admin/:taskId/update',
    [
        taskValidator.validateUpdateTask,
        JWTMiddleware.verify(["Admin"])
    ],
    taskController.update
);




module.exports = router;