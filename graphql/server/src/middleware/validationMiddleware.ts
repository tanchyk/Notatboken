import {MiddlewareFn} from "type-graphql";

export const testEmail: MiddlewareFn = ({args}, next) => {
    const test = /\S+@\S+\.\S+/;
    if(!test.test(args.email) || args.email.length < 8 || args.email.length >= 254) {
        return new Promise(resolve => resolve({
                errors: [{
                    field: "email",
                    message: "Invalid Email"
                }],
            })
        )
    }

    return next();
}