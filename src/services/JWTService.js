const jwt = require('jsonwebtoken');

require("dotenv").config()


class JwtService {

    constructor() { }


    // Create token
    createJWT = (payload) => {
        let secretKey = process.env.JWT_SECRET;
        let expiresIn = {
            expiresIn: process.env.JWT_EXPIRES_IN
        }
        return jwt.sign(payload, secretKey, expiresIn);
    }


    // Verify token
    verify(token) {
        let secretKey = process.env.JWT_SECRET;
        return jwt.verify(token, secretKey);
    }


    // Decode token
    decode(token) {
        // , { complete: true }
        return jwt.decode(token);
    }

}

module.exports = new JwtService();