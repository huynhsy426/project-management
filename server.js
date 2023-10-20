const express = require('express');
const session = require('express-session');
const app = express();
const mongoose = require('mongoose');

require('dotenv').config();

const configViewEngine = require('./src/config/viewEngine');
const errors = require('./src/error.json')

const projectRouter = require('./src/routes/projectRouter');
const userRouter = require('./src/routes/userRouter');
const deptRouter = require('./src/routes/deptRouter');
const memberRouter = require('./src/routes/memberRouter');
const testRouter = require('./src/routes/testRouter');



// Test JWT
// let payload = {
//     name: "Huynh Sy",
//     age: 23,
//     expiresIn: process.env.JWT_EXPIRES_IN
// }
// createJWT(payload);
// let decodedData = verifyToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiZXJpYyIsImFkZHJlc3MiOiJoYSBub2kiLCJpYXQiOjE2OTUzNTA2MTF9.miTHjf2nWzpay7_YOwMnL1XWiHUkv_pAh3Y7Lss1G2E")

var dirName = __dirname;
configViewEngine(app, session, dirName);

// Router
app.use("/projects", projectRouter);
app.use('/users', userRouter)
app.use('/depts', deptRouter);
app.use('/members', memberRouter);


app.use((req, res) => {
    return res.json({
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


// app.listen(8082);
// console.log('Listening on port 8082');

const start = async () => {
    try {
        await mongoose.connect(
            "mongodb://127.0.0.1:27017/project-management"
        );
        app.listen(8082, () => console.log(`Server started on port 8082`));
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

start();