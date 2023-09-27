// Midleware: verify token, validate data vao tu FE
const validateUser = (req, res, next) => {
    const user = {
        username: req.body.username,
        age: req.body.age,
        userPassword: req.body.userPassword,
        gmail: req.body.gmail,
        isBlocked: false
    }

    const errorMessage = []

    !validateJustString(user.username) && errorMessage.push("username is valid");
    !validateNumber(user.age) && errorMessage.push("age is not a number");
    !validatePassword(user.userPassword) && errorMessage.push(`password must At least one digit, one lowercase letter, one uppercase letter, one special character and between 3 and 20 characters`);
    !validateGmail(user.gmail) && errorMessage.push("Invalid email address");
    if (errorMessage.length === 0) {
        return next();
    }

    return next({
        error: new Error("INVALID_USER_INPUT_BY_CLIENT"),
        args: errorMessage
    });
}

const validateJustString = (name) => {
    const regex = /^[a-zA-Z ]{3,50}$/;
    const valid = regex.test(name)
    return valid;
};

const validateNumber = (age) => {
    const regex = /^[0-9]{0,3}$/;
    const valid = regex.test(age);
    return valid;
};

const validateGmail = (age) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const valid = regex.test(age);
    return valid;
};

const validatePassword = (password) => {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{3,20}$/;
    const valid = regex.test(password);
    return valid;
};

module.exports = {
    validateUser
}