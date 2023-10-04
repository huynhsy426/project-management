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
                this.hasBlocked(
                    data,
                    (err, isBlocked) => {
                        if (err) {
                            return next(err);
                        }
                        if (!isBlocked.isBlocked) {
                            if (Array.isArray(roles) && roles.length === 0) {
                                return next();
                            }
                            this.hasRole(
                                { data, roles },
                                (err, hasRoles) => {
                                    if (err) {
                                        return next(err);
                                    }
                                    if (hasRoles.hasRoles) {
                                        return next();
                                    }
                                }
                            )
                        }
                    }
                );

                req.user = data;
            } catch (err) {
                console.error(err);
                return next(new Error('UNAUTHORIZED'));
            }
        }
    }


    // Check role of user is Admin
    hasRole({ data, roles }, callback) {
        // check vao db
        UserModel.checkRole(
            { data, roles },
            function (err, hasRoles) {
                if (err) {
                    return callback(err);
                }
                return callback(null, hasRoles);
            }
        )
    }


    // Check user isBlocked
    hasBlocked(user, callback) {
        // check vao db
        UserModel.checkIslocked(
            user.userId,
            function (err, isBlocked) {
                if (err) {
                    return callback(err);
                }
                return callback(null, isBlocked);
            }
        );
    };

}

module.exports = new JWTMiddleware();