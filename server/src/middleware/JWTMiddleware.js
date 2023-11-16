const JwtService = require("../services/JWTService");
const userModel = require("../models/userModel");
const { ErrorCodes } = require("../constants/errorConstant");
const fse = require("fs-extra");


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
            const attachments = req.files;
            try {
                const authorization = req.headers['authorization'] || '';
                const token = authorization.split('Bearer ')[1];
                const data = JwtService.verify(token);

                const result = await getUser(data.userId);

                if (!result) {
                    throw (new Error(ErrorCodes.USER_NOT_EXIST));
                }

                // Check isBlocked token user
                if (result?.isBlocked) {
                    throw next(new Error(ErrorCodes.USER_HAS_BLOCKED));
                }
                // Check roles of token user
                if (roles.length !== 0 && !roles.includes(result.roles)) {
                    throw next(new Error(ErrorCodes.INVALID_ROLE));
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
                if (attachments) {
                    for (const item of attachments) {
                        const file = item.path;
                        await fse.remove(file);
                    }
                }
                return next(err);
            }
        }
    }
}