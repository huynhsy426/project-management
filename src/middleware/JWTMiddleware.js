const JwtService = require("../services/JWTService");
const UserModel = require("../models/userModel");
class JWTMiddleware {


    constructor() { }


    // Check Token
    verify(roles) {
        return async (req, res, next) => {
            try {
                const authorization = req.headers['authorization'] || '';
                const token = authorization.split('Bearer ')[1];
                const data = JwtService.verify(token);

                const result = await UserModel.getUser(data.userId);

                // Check isBlocked token user
                if (result.isBlocked === false) {
                    // Check roles of token user
                    if (roles.length !== 0 && !roles.includes(result.roles)) {
                        return next(new Error('INVALID_ROLE'));
                    }
                    req.user = {
                        userId: result._id,
                        username: result.username,
                        age: result.age,
                        roles: result.roles,
                        gmail: result.gmail,
                        exp: result.exp,
                        isBlocked: result.isBlocked
                    };
                    return next();
                }
                return next(new Error('USER_HAS_BLOCKED'));
            } catch (err) {
                console.error(err);
                return next(err);
            }
        }
    }
}

module.exports = new JWTMiddleware();