import {MiddlewareFn} from "type-graphql";

export const testEmail: MiddlewareFn = ({args}, next) => {
    const test = /\S+@\S+\.\S+/;
    if(!test.test(args.input.email) || args.input.email.length < 8 || args.input.email.length >= 254) {
        return new Promise(resolve => resolve({
                errors: [{
                    field: "email",
                    message: "Invalid Email"
                }]
            })
        )
    }

    return next();
}

export const testPassword: MiddlewareFn = ({args}, next) => {
    const test = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,100}/;
    if(!test.test(args.input.password)) {
        return new Promise(resolve => resolve({
                errors: [{
                    field: "password",
                    message: "Password should contain at least one number, one lowercase and one uppercase letter"
                }]
            })
        )
    }

    return next();
}

export const testUsername: MiddlewareFn = ({args}, next) => {
    const test = /^(?=.{3,64}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
    if(!test.test(args.input.username)) {
        return new Promise(resolve => resolve({
                errors: [{
                    field: "username",
                    message: "Username should contain only letters and numbers"
                }]
            })
        )
    }

    return next();
}

export const testName: MiddlewareFn = ({args}, next) => {
    const testName = /^([a-zA-Z]{2,}\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z]{1,})?)/i;
    if (!testName.test(args.input.name) || args.input.name.length < 5) {
        return new Promise(resolve => resolve({
                errors: [{
                    field: "name",
                    message: "Write your first and last name"
                }]
            })
        )
    }

    return next();
}