const JwtService = require("../services/JWTService");

const { StatusCodes } = require('http-status-codes');

class JWTMiddleware {

    constructor() { }


    verify(req, res, next) {
        const authorization = req.headers['authorization'] || '';

        const token = authorization.split('Bearer ')[1];
        console.log({ token })
        const valid = JwtService.verify(token);
        return valid ?
            next() :
            res.status(StatusCodes.UNAUTHORIZED).json({
                error: 'Unauthorized'
            })
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