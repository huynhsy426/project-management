const JwtService = require("../services/JWTService");
class JWTMiddleware {

    constructor() { }


    verify(req, res, next) {
        try {
            const authorization = req.headers['authorization'] || '';
            const token = authorization.split('Bearer ')[1];
            JwtService.verify(token);
            console.log(JwtService.verify(token), "true verify")
            return next();
        } catch (err) {
            return next(new Error('UNAUTHORlIZED'));
        }

    }


    hasRole(req, res, next) {
        console.log("here 1")

        console.log("here 2")
        const authorization = req.headers['authorization'] || '';
        const token = authorization.split('Bearer ')[1];
        console.log(token);
        const decoded = JwtService.decode(token);
        console.log(decoded.roles, "decoded token");
        console.log(typeof decoded)
        const foundRole = decoded.roles === "Admin";
        return foundRole ?
            next() :
            next(new Error("FORBIDDEN"))
    }

}

module.exports = new JWTMiddleware();