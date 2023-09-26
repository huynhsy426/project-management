const express = require('express');
const session = require('express-session');
const app = express();

require('dotenv').config();

const configViewEngine = require('./src/config/viewEngine');
const errors = require('./src/error.json')

const loginRouter = require('./src/routes/projectRouter');
const userRouter = require('./src/routes/userRouter');
const deptRouter = require('./src/routes/deptRouter');



// Test JWT
// let payload = {
//     name: "Huynh Sy",
//     age: 23,
//     expiresIn: process.env.JWT_EXPIRES_IN
// }
// createJWT(payload);
// let decodedData = verifyToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiZXJpYyIsImFkZHJlc3MiOiJoYSBub2kiLCJpYXQiOjE2OTUzNTA2MTF9.miTHjf2nWzpay7_YOwMnL1XWiHUkv_pAh3Y7Lss1G2E")
// console.log(decodedData)==

var dirName = __dirname;
configViewEngine(app, session, dirName);


app.use("/project", loginRouter);

app.use('/user', userRouter)

app.use('/dept', deptRouter);


app.use((req, res) => {
    return res.json({
        messageCode: 'DEFAULT_ERROR_404',
        message: 'Something went wrong'
    });
})


app.use((error, req, res, next) => {
    // KHi next co tham so thi req chay ve day
    const messageCode = error.message;
    const definedCode = errors[messageCode];
    console.log(error)
    if (definedCode) {
        return res.json({
            messageCode: definedCode,
            message: error[definedCode],
        })
    }
    return res.json({
        messageCode: 'DEFAULT_ERROR',
        message: 'Something went wrong'
    });
});


app.listen(8082);
console.log('Listening on port 8081');