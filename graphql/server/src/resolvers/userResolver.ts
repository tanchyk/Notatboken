import {Arg, Ctx, Int, Mutation, Resolver, UseMiddleware} from "type-graphql";
import {User} from "../entities/User";
import {ConfirmationResponse, EditUserInput, MyContext, UserResponse} from "../utils/types/types";
import {isAuth} from "../middleware/isAuth";
import argon2 from "argon2";
import {getRepository} from "typeorm";
import {testEmail, testName, testPassword, testUsername} from "../middleware/validationMiddleware";
import {CHANGE_EMAIL_PREFIX, COOKIE_NAME} from "../utils/types/constants";
import {changeEmailConformation} from "../utils/mailer";

const cloudinary = require("cloudinary").v2;

@Resolver(User)
export class UserResolver {
    @Mutation(() => UserResponse)
    @UseMiddleware(isAuth, testUsername, testEmail, testName)
    async editUser(
        @Arg("input") input: EditUserInput,
        @Ctx() {req, redis}:MyContext
    ): Promise<UserResponse> {
        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail({relations: ["userLanguages"], where: {id: req.session.userId}});
        } catch (err) {
            return {
                errors: [{
                    field: "user",
                    message: "User does not exists"
                }],
                user: null
            }
        }

        //Checking if data already in database
        const checkExisting: User | undefined = await userRepository.findOne({
            where : [{
                username : input.username,
            }, {
                email : input.email,
            }]
        });

        if(checkExisting && checkExisting!.username === input.username && checkExisting!.username !== user.username) {
            return {
                errors: [{
                    field: "username",
                    message: "Username is already taken"
                }],
                user: null
            }
        } else if(checkExisting && checkExisting!.email === input.email && checkExisting!.email !== user.email) {
            return {
                errors: [{
                    field: "email",
                    message: "Email is already taken"
                }],
                user: null
            }
        }

        if(input.avatarData && input.avatarData !== user.avatar) {
            try {
                await cloudinary.config({
                    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                    api_key: process.env.CLOUDINARY_KEY,
                    api_secret: process.env.CLOUDINARY_SECRET
                });

                const uploadResponse = await cloudinary.uploader.upload_large(input.avatarData, {
                    upload_presets: 'user_avatar',
                    resource_type: "image",
                    chunk_size: 5000000,
                    transformation: [
                        {width: 400, height: 400, gravity: "face", crop: "thumb"},

                    ],
                })
                user.avatar = uploadResponse.secure_url;
            } catch (e) {
                console.log('Error', e);
            }
        }

        user.name = input.name;
        user.username = input.username;

        if(input.email !== user.email) {
            const response = await changeEmailConformation(user, input.email, redis);
            if(response.errors) {
                return {
                    errors: response.errors,
                    user: null
                }
            }
        }

        //Try to save, if it fails, that means username or email already in use
        try {
            await userRepository.save(user);
        } catch (e) {
            return {
                errors: [{
                    field: "username",
                    message: "Username is already in use"
                }],
                user: null
            }
        }

        return {
            errors: null,
            user: user
        }
    }

    @Mutation(() => ConfirmationResponse)
    @UseMiddleware(isAuth)
    async confirmEmailChange(
        @Arg("token") token: string,
        @Ctx() {req, redis}: MyContext
    ): Promise<ConfirmationResponse> {
        const email = await redis.get(CHANGE_EMAIL_PREFIX+`${req.session.userId}`+token);

        if(!email) {
            return {
                errors: [{
                    field: "token",
                    message: "Token has already expired"
                }],
                confirmed: false
            }
        }

        const userRepository = getRepository(User);
        const user = await userRepository.findOne({ where: {id: req.session.userId}});

        if(!user) {
            return {
                errors: [{
                    field: "token",
                    message: "User no longer exists"
                }],
                confirmed: false
            }
        }

        user.email = email;
        await userRepository.save(user);

        await redis.del(CHANGE_EMAIL_PREFIX+`${req.session.userId}`+token);

        return {
            errors: null,
            confirmed: true
        }
    }

    @Mutation(() => ConfirmationResponse)
    @UseMiddleware(isAuth)
    async changePassword(
        @Arg("newPassword") newPassword: string,
        @Arg("oldPassword") oldPassword: string,
        @Ctx() {req}: MyContext
    ): Promise<ConfirmationResponse> {
        const testPassword = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,100}/;
        if(!testPassword.test(newPassword)) {
            return {
                errors: [{
                    field: "newPassword",
                    message: "Password should contain at least one number, one lowercase and one uppercase letter"
                }],
                confirmed: false
            }
        }

        //Try to find user on database
        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail({where: {id: req.session.userId}});
        } catch (err) {
            return {
                errors: [{
                    field: "newPassword",
                    message: "User is not exists"
                }],
                confirmed: false
            }
        }

        //Checking password
        if(! await argon2.verify(user.password, oldPassword)) {
            return {
                errors: [{
                    field: "oldPassword",
                    message: "Incorrect password"
                }],
                confirmed: false
            }
        }

        if(newPassword === oldPassword) {
            return {
                errors: [{
                    field: "newPassword",
                    message: "Please, change your password"
                }],
                confirmed: false
            }
        }

        user.password = await argon2.hash(newPassword);
        await userRepository.save(user);

        return {
            errors: null,
            confirmed: true
        }
    }

    @Mutation(() => ConfirmationResponse)
    @UseMiddleware(isAuth)
    async editGoal(
        @Arg("userGoal", () => Int) userGoal: number,
        @Ctx() {req}: MyContext
    ): Promise<ConfirmationResponse> {
        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail({where: {id: req.session.userId}});
        } catch (err) {
            return {
                errors: [{
                    field: "userGoal",
                    message: "User is not exists"
                }],
                confirmed: false
            }
        }

        if(userGoal === 5 || userGoal === 10 || userGoal === 15 || userGoal === 20) {
            user.userGoal = userGoal;
            await userRepository.save(user);
        }

        return {
            errors: null,
            confirmed: true
        }
    }

    @Mutation(() => ConfirmationResponse)
    @UseMiddleware(isAuth, testPassword)
    async deleteUser(
        @Arg("password") password: string,
        @Ctx() {req, res}: MyContext
    ): Promise<ConfirmationResponse> {
        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail({where: {id: req.session.userId}});
        } catch (err) {
            return {
                errors: [{
                    field: "password",
                    message: "User is not exists"
                }],
                confirmed: false
            }
        }

        //Checking password
        if (!await argon2.verify(user.password, password)) {
            return {
                errors: [{
                    field: "password",
                    message: "Incorrect password"
                }],
                confirmed: false
            }
        }

        await userRepository.delete({id: req.session.userId});
        await res.clearCookie(COOKIE_NAME);

        return {
            errors: null,
            confirmed: true
        }
    }
}