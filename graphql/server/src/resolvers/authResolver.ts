require('dotenv').config();
import {Arg, Ctx, Mutation, Query, Resolver, UseMiddleware} from "type-graphql";
import {User} from "../entities/User";
import {ConfirmationResponse, EmailResponse, LoginInput, MyContext, RegisterInput, UserResponse} from "../types/types";
import argon2 from "argon2";
import {v4} from "uuid";
import { getRepository } from "typeorm";
import {COOKIE_NAME, FORGET_PASSWORD_PREFIX, REGISTER_PREFIX} from "../types/constants";
import {sendEmailConformation, transporter} from "../utils/mailer";
import { testEmail, testUsername, testPassword } from "../middleware/validationMiddleware";

@Resolver(User)
export class AuthResolver {
    @Query(() => User, {nullable: true})
    async me(
        @Ctx() {req}: MyContext
    ) {
        if(!req.session.userId) {
            return null;
        } else {
            const userRepository = getRepository(User);
            return userRepository.findOne({ where: {id: req.session.userId}});
        }
    }

    @Mutation(() => EmailResponse)
    @UseMiddleware(testEmail, testUsername, testPassword)
    async register(
        @Arg("input") input: RegisterInput,
        @Ctx() {redis}: MyContext
    ) {
        const userRepository = await getRepository(User);

        const checkExisting: User | undefined = await userRepository.findOne({
            where : [{
                username : input.username,
            }, {
                email : input.email,
            }]
        });

        if(checkExisting && checkExisting!.username === input.username) {
            return {
                errors: [{
                    field: 'username',
                    message: 'Username is already taken'
                }],
                send: false
            }
        } else if(checkExisting && checkExisting!.email === input.email) {
            return {
                errors: [{
                    field: 'email',
                    message: 'Email is already taken'
                }],
                send: false
            }
        }

        const user = new User();

        user.username = input.username;
        user.email =  input.email;
        user.password = await argon2.hash(input.password);

        try {
            await userRepository.save(user);
        } catch (e) {
            return {
                errors: [{
                    field: 'email',
                    message: "Email is already in use"
                }],
                send: false
            }
        }

        return sendEmailConformation(user, redis);
    }

    @Mutation(() => EmailResponse)
    @UseMiddleware(testEmail)
    async requestEmailConfirmation(
        @Arg("email") email: string,
        @Ctx() {redis}: MyContext
    ): Promise<EmailResponse> {
        const userRepository = getRepository(User);
        const user = await userRepository.findOne({where: email});

        if(!user) {
            return {
                errors: null,
                send: true
            };
        }

        return sendEmailConformation(user, redis);
    }

    @Mutation(() => ConfirmationResponse)
    async confirmRegistration(
        @Arg("token") token: string,
        @Ctx() {redis}: MyContext
    ): Promise<ConfirmationResponse> {
        const userId = await redis.get(REGISTER_PREFIX+token);

        if(!userId) {
            return {
                errors: [{
                    field: "token",
                    message: "Token has already expired"
                }],
                confirmed: false
            }
        }

        const userRepository = getRepository(User);
        const user = await userRepository.findOne({ where: {id: parseInt(userId)}});

        if(!user) {
            return {
                errors: [{
                    field: "token",
                    message: "User no longer exists"
                }],
                confirmed: false
            }
        }

        user.confirmed = true;
        await userRepository.save(user);

        await redis.del(REGISTER_PREFIX+token);

        return {
            errors: null,
            confirmed: true
        }
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg("input") input: LoginInput,
        @Ctx() {req}: MyContext
    ): Promise<UserResponse> {
        const incorrectUsernameOrEmail = {
            errors: [{
                field: 'usernameOrEmail',
                message: 'Incorrect username/email or password'
            }],
            user: null
        }

        if (!(input.usernameOrEmail && input.password)) {
            return {
                errors: [{
                    field: 'usernameOrEmail',
                    message: 'Incorrect data'
                }],
                user: null
            }
        }

        //Search for user
        const userRepository = await getRepository(User);
        let user: User;

        if(input.usernameOrEmail.includes('@')) {
            try {
                user = await userRepository.findOneOrFail({ relations: ["userLanguages"], where: {email: input.usernameOrEmail}});
            } catch (e) {
                return incorrectUsernameOrEmail;
            }
        } else {
            try {
                user = await userRepository.findOneOrFail({ relations: ["userLanguages"], where: {username: input.usernameOrEmail}});
            } catch (e) {
                return incorrectUsernameOrEmail;
            }
        }

        if(!user.confirmed) {
            return {
                errors: [{
                    field: 'usernameOrEmail',
                    message: 'Please, confirm your email'
                }],
                user: null
            }
        }

        //Checking password
        if(! await argon2.verify(user.password, input.password)) {
            return incorrectUsernameOrEmail;
        }

        req.session.userId = user.id;

        return {
            errors: null,
            user: user
        };
    }

    @Mutation(() => Boolean)
    logout(
        @Ctx() {req, res}: MyContext
    ) {
        return new Promise<boolean>(resolve => req.session.destroy(err => {
            if(err) {
                console.log(err);
                return resolve(false);
            } else {
                res.clearCookie(COOKIE_NAME);
                return resolve(true);
            }
        }))
    }

    @Mutation(() => EmailResponse)
    @UseMiddleware(testEmail)
    async forgotPassword(
        @Arg("email") email: string,
        @Ctx() {redis}: MyContext
    ): Promise<EmailResponse> {
        const userRepository = getRepository(User);
        const user = await userRepository.findOne({
            where: {email}
        });

        if(!user) {
            return {
                errors: null,
                send: true
            };
        }

        try {
            const token = v4();
            await redis.set(
                FORGET_PASSWORD_PREFIX+token,
                user.id,
                "ex",
                1000*60*60*24
            );

            const url = `${process.env.CORS_ORIGIN}/change-password/${token}`;

            await transporter.sendMail({
                from: `${process.env.GMAIL_USER}`,
                to: user.email,
                subject: "Change Password",
                html: `
                    <div style="margin: 40px; padding: 40px; border: 1px solid #4A5568; border-radius: 0.5rem; display: flex; flex-direction: row; flex-wrap: wrap;">
                        <div style="padding: 40px;">
                            <img style="width: 200px; height: 200px;" src="https://res.cloudinary.com/dw3hb6ec8/image/upload/v1614425565/mainpage/change_password_mr16nb.png" />
                        </div>
                        <div style="padding: 40px;">
                            <h1>Please click this link to change your password: </h1>
                            <a href="${url}">Change Password</a>
                        </div>
                    </div>
                `
            });

            return {
                errors: null,
                send: true
            };
        } catch (e) {
            console.log(e);
            return {
                errors: [{
                    field: "email",
                    message: "Ooops, something wrong with our service"
                }],
                send: false
            }
        }
    }

    @Mutation(() => ConfirmationResponse)
    @UseMiddleware(testPassword)
    async resetPassword(
        @Arg("token") token: string,
        @Arg("password") password: string,
        @Ctx() {redis}: MyContext
    ): Promise<ConfirmationResponse> {
        const userId = await redis.get(FORGET_PASSWORD_PREFIX+token);

        if(!userId) {
            return {
                errors: [{
                    field: "token",
                    message: "Token has already expired"
                }],
                confirmed: false
            }
        }

        const userRepository = getRepository(User);
        const user = await userRepository.findOne({ where: {id: parseInt(userId)}});

        if(!user) {
            return {
                errors: [{
                    field: "token",
                    message: "User no longer exists"
                }],
                confirmed: false
            }
        }

        user.password = await argon2.hash(password);
        await userRepository.save(user);

        await redis.del(FORGET_PASSWORD_PREFIX+token);

        return {
            errors: null,
            confirmed: true
        }
    }
}