const express = require('express');
const session = require('express-session');
const app = express();

require('dotenv').config();

const configViewEngine = require('./src/config/viewEngine');

const loginRouter = require('./src/routes/projectRouter');
const userRouter = require('./src/routes/userRouter');
const deptRouter = require('./src/routes/deptRouter');

const { createJWT, verifyToken } = require("./src/middleware/JWTActions")

// Test JWT
let payload = {
    name: "Huynh Sy",
    age: 23,
    expiresIn: process.env.JWT_EXPIRES_IN
}
createJWT(payload);
// let decodedData = verifyToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiZXJpYyIsImFkZHJlc3MiOiJoYSBub2kiLCJpYXQiOjE2OTUzNTA2MTF9.miTHjf2nWzpay7_YOwMnL1XWiHUkv_pAh3Y7Lss1G2E")
// console.log(decodedData)==

var dirName = __dirname;
configViewEngine(app, session, dirName);

app.use("/project", loginRouter);

app.use('/user', userRouter)

app.use('/dept', deptRouter);


app.use((req, res) => {
    return res.send("404 not found");
})

app.listen(8082);
console.log('Listening on port 8081');