//Validation functions

import * as Yup from "yup";

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
    const testUsername = /^(?=.{3,64}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
    if (!testUsername.test(value)) {
        error = "Please, enter a valid Username";
    }
    return error;
}

export const validateCard = (value: string) => {
    let error;
    const testCard = /^(?=.{1,84}$)[A-ZА-ЯЁa-zа-яё0-9äöüßÄÖÜæÆøØåÅ,;\s]+[A-ZА-ЯЁa-zа-яё0-9äöüßÄÖÜæÆøØåÅ.?!]$/;
    if (!testCard.test(value)) {
        error = "Please, enter a valid word or a sentence";
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
    const testPassword = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,100}/;
    if (!testPassword.test(value)) {
        error = "Please, enter a valid Password";
    }
    return error
}

export const DeckNameSchema = Yup.object().shape({
    deckName: Yup.string()
        .min(3, 'Too Short, name should be longer than 3.')
        .max(40, 'Too Long, name should be shorter than 40.')
        .required('Required')
});