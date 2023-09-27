const { StatusCodes } = require('http-status-codes');
// Midleware: verify token, validate data vao tu FE
const validateUser = (req, res, next) => {
    console.log("here is")
    const user = {
        username: req.body.username,
        age: req.body.age,
        userPassword: req.body.userPassword,
        gmail: req.body.gmail,
        isBlocked: false
    }
    let count = 0;

    const errorMessage = {
        usernameMessage: "",
        ageMessage: "",
        passwordMessage: "",
        gmailMessage: ""
    }

    validateJustString(user.username) ? count++ : errorMessage.usernameMessage = "username is valid";
    validateNumber(user.age) ? count++ : errorMessage.ageMessage = "age is not a number";
    validatePassword(user.userPassword) ?
        count++ :
        errorMessage.passwordMessage = `password must At least one digit, one lowercase letter, one uppercase letter, one special character and between 3 and 20 characters`;
    validateGmail(user.gmail) ? count++ : errorMessage.gmailMessage = "Invalid email address";
    console.log(count);
    if (count === 4) {
        next();
    } else {
        res.status(StatusCodes.BAD_REQUEST).json({
            errorMessage: errorMessage
        })
    }


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


// UserModels.isUserNameAndGmailExist(
//     { user },
//     function (error, result) {
//         if (error) {
//             console.log("error here")
//             return next(error);
//         }

//         console.log("Exist here")
//         return next();
//     });

module.exports = {
    validateUser
}