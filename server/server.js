const express = require('express');
const session = require('express-session');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const cors = require('cors');

const projectRouter = require('./src/routes/projectRouter');
const userRouter = require('./src/routes/userRouter');
const deptRouter = require('./src/routes/deptRouter');
const memberRouter = require('./src/routes/memberRouter');
const taskRouter = require('./src/routes/taskRouter');
const reportRouter = require('./src/routes/reportRouter');
const commentRouter = require('./src/routes/commentRouter');

const connection = require('./src/models/connection');
const errors = require('./src/error.json');

const JwtService = require("./src/services/JWTService");
const userModel = require("./src/models/userModel");
const { ErrorCodes } = require("./src/constants/errorConstant");

require('./src/utils/crisp3');

require('dotenv').config();
const app = express();
const server = createServer(app);

const io = new Server(server, ({
    allowEIO3: true,
    cors: {
        origin: 'http://localhost:8080',
        methods: ['GET', 'POST']
    },
    transports: ["polling", "websocket"],
    allowRequest: (req, callback) => {
        callback(null, true);
    }
}));

const configViewEngine = require('./src/config/viewEngine');

// config project
let dirName = __dirname;
configViewEngine({ cors, app, session, dirName });

// Router
app.use("/projects", projectRouter);
app.use('/users', userRouter);
app.use('/depts', deptRouter);
app.use('/members', memberRouter);
app.use('/tasks', taskRouter);
app.use('/reports', reportRouter);
app.use('/comments', commentRouter);


// ----------------------- Socket.io -----------------------

const getUser = async (userId) => {
    try {
        const result = await userModel.findById(
            userId,
            {
                roles: 1, username: 1,
                age: 1, email: 1,
                exp: 1, isBlocked: 1
            }
        ).limit(1);

        return result;
    } catch (err) {
        throw err;
    }
};

io.use(async (socket, next) => {
    try {
        const authorization = socket.handshake.auth.authorization || '';
        const token = authorization.split('Bearer ')[1];
        const data = JwtService.verify(token);

        const result = await getUser(data.userId);
        if (!result) {
            throw (new Error(ErrorCodes.USER_NOT_EXIST));
        }

        // Check isBlocked token user
        if (result?.isBlocked) {
            throw next(new Error(ErrorCodes.USER_HAS_BLOCKED));
        }

        return next();
    } catch (err) {
        return next(err);
    }
})


let socketsConnected = new Set();


io.on('connection', (socket) => {
    console.log(socket.id, 'a user connected');

    socketsConnected.add(socket.id);

    socket.on("room", (data) => {
        socket.join(data);
    })

    socket.on('disconnect', () => {
        console.log(socket.id, "user disconnected");
        socketsConnected.delete(socket.id);
    })


    socket.on("message", (data) => {
        io.to(data.room).emit("chat-message", data.comment);
    })

});




// ------------------------------------------------------


// -------------------- Handle errors -------------------


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
