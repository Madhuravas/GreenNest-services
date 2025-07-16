const validater = require("validator");


function validate(req){
    const { name, emailId, password } = req.body;
    if (!name || !emailId || !password) {
        throw new Error("All fields are required");
    }

    if (!validater.isEmail(emailId)) {
        throw new Error("Invalid email format");
    }

    if(!validater.isStrongPassword(password)){
        throw new Error("Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one symbol");
    }

    return { isValid: true };
}

module.exports = validate;