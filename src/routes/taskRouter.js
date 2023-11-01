const express = require('express');
const router = express.Router();

const taskValidator = require('../validations/taskValidator');
const JWTMiddleware = require('../middleware/JWTMiddleware');
const taskController = require('../controller/taskController');

const upload = require('../middleware/saveFile');

router.get('/list', taskController.listTask);

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
)




module.exports = router;