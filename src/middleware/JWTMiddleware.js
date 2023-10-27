const JwtService = require("../services/JWTService");
const userModel = require("../models/userModel");


const getUser = async (userId) => {
    try {
        const result = await userModel.findById(
            userId,
            {
                roles: 1, username: 1,
                age: 1, gmail: 1,
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
                if (result.isBlocked === false) {
                    // Check roles of token user
                    if (roles.length !== 0 && !roles.includes(result.roles)) {
                        return next(new Error('INVALID_ROLE'));
                    }
                    req.user = {
                        userId: JSON.stringify(result._id).split('"')[1],
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