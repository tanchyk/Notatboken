import {Arg, Mutation, Query, Resolver} from "type-graphql";
import {User} from "../entities/User";
import {EmailResponse, LoginInput, RegisterInput, UserResponse} from "../types";
import argon2 from "argon2";
import { getRepository } from "typeorm";

@Resolver(User)
export class UserResolver {
    @Query(() => String)
    me() {
        return "hello"
    }

    @Mutation(() => EmailResponse)
    async register(
        @Arg("input") input: RegisterInput
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

        return {
            errors: null,
            send: true
        };
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg("input") input: LoginInput
    ) {
        const incorrectUsernameOrEmail = {
            errors: [{
                field: 'usernameOrPassword',
                message: 'Incorrect username/email or password'
            }],
            user: null
        }

        if (!(input.usernameOrEmail && input.password)) {
            return {
                errors: [{
                    field: 'usernameOrPassword',
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
                    field: 'usernameOrPassword',
                    message: 'Please, confirm your email'
                }],
                user: null
            }
        }

        //Checking password
        if(! await argon2.verify(user.password, input.password)) {
            return incorrectUsernameOrEmail;
        }

        return incorrectUsernameOrEmail;
    }
}