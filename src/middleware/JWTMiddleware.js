const JwtService = require("../services/JWTService");
const userModel = require("../models/userModel");
const { ErrorCodes } = require("../constants/errorConstant");


const getUser = async (userId) => {
    try {
        const result = await userModel.findById(
            userId,
            {
                roles: 1, username: 1,
                age: 1, email: 1,
                exp: 1, isBlocked: 1
            }
        ).limit(1);

        return result;
    } catch (err) {
        throw err;
    }
};

module.exports = {
    // Check Token
    verify: (roles) => {
        return async (req, res, next) => {
            try {
                const authorization = req.headers['authorization'] || '';
                const token = authorization.split('Bearer ')[1];
                const data = JwtService.verify(token);

                const result = await getUser(data.userId);

                // Check isBlocked token user
                if (result.isBlocked) {
                    return next(new Error(ErrorCodes.USER_HAS_BLOCKED));
                }
                // Check roles of token user
                if (roles.length !== 0 && !roles.includes(result.roles)) {
                    return next(new Error(ErrorCodes.INVALID_ROLE));
                }
                req.user = {
                    userId: JSON.stringify(result._id).split('"')[1],
                    username: result.username,
                    age: result.age,
                    roles: result.roles,
                    email: result.email,
                    exp: result.exp,
                    isBlocked: result.isBlocked
                };
                return next();
            } catch (err) {
                console.error(err);
                return next(err);
            }
        }
    }
}