const JwtService = require("../services/JWTService");
const UserModel = require("../models/userModel");
class JWTMiddleware {


    constructor() { }


    // Check Token
    verify(roles = []) {
        return async (req, res, next) => {
            try {
                const authorization = req.headers['authorization'] || '';
                const token = authorization.split('Bearer ')[1];
                const data = JwtService.verify(token);

                const result = await UserModel.getUser(data.userId)

                // Check isBlocked token user
                if (result[0].isBlocked === 0) {
                    // Check roles of token user
                    if (roles.length !== 0 && !roles.includes(result[0].roles)) {
                        return next(new Error('INVALID_ROLE'));
                    }
                    req.user = {
                        userId: result[0].userId,
                        username: result[0].username,
                        age: result[0].age,
                        roles: result[0].roles,
                        gmail: result[0].gmail,
                        exp: result[0].exp,
                        isBlocked: result[0].isBlocked
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