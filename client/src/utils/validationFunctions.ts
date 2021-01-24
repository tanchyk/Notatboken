//Validation functions

export const validateUsernameOrEmail = (value: string) => {
    let error;
    if (value.includes('@')) {
        error = validateEmail(value);
    } else {
        error = validateUsername(value);
    }
    return error;
}

export const validateUsername = (value: string) => {
    let error;
    const testUsername = /\w/;
    if (!testUsername.test(value) || value.length < 3 || value.length > 64) {
        error = "Please, enter a valid Username";
    }
    return error;
}

export const validateEmail = (value: string) => {
    let error;
    const testEmail = /\S+@\S+\.\S+/;
    if (!testEmail.test(value) || value.length < 8 || value.length > 264) {
        error = "Please, enter a valid Email";
    }
    return error;
}

export const validatePassword = (value: string) => {
    let error;
    const testPassword = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}/;
    if (!testPassword.test(value)) {
        error = "Please, enter a valid Password";
    }
    return error
}