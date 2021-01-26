import {Response, Request, NextFunction} from 'express';
import {getRepository} from "typeorm";
import {User} from "../entities/User";
import argon2 from "argon2";

class UserController {
    static singleUser = async (req: Request, res: Response, next: NextFunction) => {
        const userId = res.locals.userId;

        //Search for user
        const userRepository = getRepository(User);
        let user: User;

        try {
            user = await userRepository.findOneOrFail({where: {id: userId}});
            if(user) {
                res.status(200).json({
                    userId: user.id,
                    name: user.name,
                    username: user.username,
                    email: user.email
                });
            } else {
                throw new Error('User not found')
            }
        } catch (err) {
            next(err);
        }
    }

    static editUser = async (req: Request, res: Response) => {
        const userId = res.locals.userId;

        const { name, username, email } = req.body;

        //Try to find user on database
        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail({where: {id: userId}});
        } catch (err) {
            return res.status(404).send({message: "User not found"});
        }

        //Testing data
        const testEmail = /\S+@\S+\.\S+/;
        if(!testEmail.test(email) || email.length < 8 || email.length >= 254) {
            return res.status(400).send({message: 'Invalid Email'});
        }

        const testUsername = /\w/;
        if(!testUsername.test(username) || username.length < 3 || username.length > 64) {
            return res.status(400).send({message: 'Invalid Username'});
        }

        const testName = /^[a-zA-Z].*[\s\.]*$/g;
        if (!testName.test(name) || name.length < 5) {
            return res.status(400).send({message: 'Invalid Name'});
        }

        user.name = name;
        user.email = email;
        user.username = username;

        //Try to save, if it fails, that means username or email already in use
        try {
            await userRepository.save(user);
        } catch (e) {
            return res.status(409).send({message: 'Username or Email is already in use'});
        }
        //After all send a 204 (no content, but accepted) response
        return res.status(204).send({message: 'User is updated'});
    }

    static changeUserPassword = async (req: Request, res: Response, next: NextFunction) => {
        const userId = res.locals.userId;

        const { newPassword, oldPassword } = req.body;

        //Checking new password
        const testPassword = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}/;
        if(!testPassword.test(newPassword) || newPassword.length > 100) {
            return res.status(400).send({message: 'Password should contain at least one number, one lowercase and one uppercase letter'});
        }

        //Try to find user on database
        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail({where: {id: userId}});
        } catch (err) {
            return res.status(404).send({message: "User not found"});
        }

        //Checking password
        if(! await argon2.verify(user.password, oldPassword)) {
            return res.status(401).send({message: 'Incorrect password'});
        }

        if(newPassword === oldPassword) {
            return res.status(401).send({message: 'Please, change your password'});
        }

        //Changing password
        try {
            user.password = await argon2.hash(newPassword);
            await userRepository.save(user);
        } catch (err) {
            next(err);
        }

        return res.status(201).send({message: 'Password is changed'});
    }

    static deleteUser = async (req: Request, res: Response, next: NextFunction) => {
        const userId = res.locals.userId;

        const userRepository = getRepository(User);

        try {
            await userRepository.delete(userId);
        } catch (err) {
            next(err);
        }

        return res.status(201).send({message: 'User is deleted'});
    }
}

export default UserController;