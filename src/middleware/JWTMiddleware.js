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


    hasRole() {
        return (req, res, next) => {
            const authorization = req.headers['authorization'] || '';
            const token = authorization.split('Bearer ')[1];
            console.log(token);
            const decoded = JwtService.decode(token);
            const foundRole = decoded.payload.roles.find(e => e.role === "Admin");
            return foundRole ?
                next() :
                res.status(403).send({ error: 'Access Denied' });
        }
    }

}

module.exports = new JWTMiddleware();