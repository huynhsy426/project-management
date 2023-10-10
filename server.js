const express = require('express');
const session = require('express-session');
const app = express();

require('dotenv').config();

const configViewEngine = require('./src/config/viewEngine');
const errors = require('./src/error.json')

const projectRouter = require('./src/routes/projectRouter');
const userRouter = require('./src/routes/userRouter');
const deptRouter = require('./src/routes/deptRouter');
const memberRouter = require('./src/routes/memberRouter');



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
app.use("/project", projectRouter);
app.use('/user', userRouter)
app.use('/dept', deptRouter);
app.use('/member', memberRouter);


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


app.listen(8082);
console.log('Listening on port 8082');