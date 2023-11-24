const express = require('express');
const session = require('express-session');
const { createServer } = require('node:http');


const projectRouter = require('./src/routes/projectRouter');
const userRouter = require('./src/routes/userRouter');
const deptRouter = require('./src/routes/deptRouter');
const memberRouter = require('./src/routes/memberRouter');
const taskRouter = require('./src/routes/taskRouter');
const reportRouter = require('./src/routes/reportRouter');

const connection = require('./src/models/connection');
const errors = require('./src/error.json');

require('./src/utils/crisp3');

require('dotenv').config();
const app = express();
const server = createServer(app);

const configViewEngine = require('./src/config/viewEngine');

// config project
var dirName = __dirname;
configViewEngine(app, session, dirName);

// Router
app.use("/projects", projectRouter);
app.use('/users', userRouter)
app.use('/depts', deptRouter);
app.use('/members', memberRouter);
app.use('/tasks', taskRouter);
app.use('/reports', reportRouter);


app.use((req, res) => {
    return res.status(500).json({
        messageCode: 'DEFAULT_ERROR_404',
        message: 'Something went wrong'
    });
})


app.use((error, req, res, next) => {
    // KHi next co tham so thi req chay ve day
    console.log(error);
    const errorCode = error.message;
    const definedCode = errors[errorCode]?.message;
    // Error when take Error
    if (definedCode) {
        const statusCode = errors[errorCode].statusCode;
        return res.status(statusCode).json({
            messageCode: definedCode,
            message: error[definedCode],
        });
    }

    // Error when client input wrong
    if (error.args && error.args.length !== 0) {
        return res.status(400).json({
            messageCode: error.error.message,
            message: error[error.error.message],
            args: error.args
        })
    }

    // Default error
    return res.status(500).json({
        messageCode: 'DEFAULT_ERROR',
        message: 'Something went wrong'
    });
});


const start = async () => {
    try {
        await connection();
        server.listen(8082, () => console.log(`Server started on port 8082`));
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

start();