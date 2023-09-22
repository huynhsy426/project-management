const Jwt = require('jsonwebtoken');

require("dotenv").config()

// console.log(process.env)

const createJWT = (payload) => {
    let key = process.env.JWT_SECRET;
    let token = null;
    try {
        token = Jwt.sign(payload, key);
        console.log(token);
    }
    catch (err) {
        console.log(err)
    }
    return token;
}

const verifyToken = (token) => {
    let key = process.env.JWT_SECRET;
    let data = null;

    try {
        const decoded = Jwt.verify(token, key);
        data = decoded
    } catch (err) {
        console.log(err);
    }
    return data;
};

module.exports = {
    createJWT,
    verifyToken
}