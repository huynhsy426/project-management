const jwt = require('jsonwebtoken');

require("dotenv").config()


class JwtService {

    constructor() { }


    // Create token
    createJWT = (payload) => {
        let secretKey = process.env.JWT_SECRET;
        let expiresIn = {
            expiresIn: "5m"
        }
        return jwt.sign(payload, secretKey);
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