const JwtService = require("../services/JWTService");
const UserModel = require("../models/userModel");
class JWTMiddleware {


    constructor() { }


    // Check Token
    verify(roles) {
        return (req, res, next) => {
            try {
                const authorization = req.headers['authorization'] || '';
                const token = authorization.split('Bearer ')[1];
                const data = JwtService.verify(token);

                UserModel.getUser(data.userId)
                    .then(user => {
                        if (user[0].isBlocked === 0) {
                            if (roles.length !== 0 && !roles.includes(user[0].roles)) {
                                return next(new Error('INVALID_ROLE'));
                            }
                            req.user = user[0];
                            return next();
                        }
                        return next(new Error('USER_HAS_BLOCKED'));
                    })
                    .catch(err => {
                        return next(err);
                    })
            } catch (err) {
                console.error(err);
                return next(new Error('UNAUTHORIZED'));
            }
        }
    }
}

module.exports = new JWTMiddleware();