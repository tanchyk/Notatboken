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
            user = await userRepository.findOneOrFail({ relations: ["userLanguages"], where: {id: userId}});
            if(user) {
                res.status(200).json({
                    userId: user.id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    languages: user.userLanguages,
                    userGoal: user.userGoal
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

        const { name, username, email} = req.body;

        //Try to find user on database
        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail({where: {id: userId}});
        } catch (err) {
            return res.status(404).send({message: "User not found"});
        }

        //Checking if data already in database
        const checkExisting: User | undefined = await userRepository.findOne({
            where : [{
                username : username,
            }, {
                email : email,
            }]
        });

        if(checkExisting && checkExisting!.username === username && checkExisting!.username !== user.username) {
            return res.status(409).send({message: 'Username is already taken'});
        } else if(checkExisting && checkExisting!.email === email && checkExisting!.email !== user.email) {
            return res.status(409).send({message: 'Email is already taken'});
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

        return res.status(200).send({
            userId: user.id,
            name: user.name,
            username: user.username,
            email: user.email
        });
    }

    static editGoal = async (req: Request, res: Response) => {
        const userId = res.locals.userId;

        const {userGoal} = req.body;

        //Try to find user on database
        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail({where: {id: userId}});
        } catch (err) {
            return res.status(404).send({message: "User not found"});
        }

        user.userGoal = userGoal;
        await userRepository.save(user);

        return res.status(204).send();
    }

    static changeUserPassword = async (req: Request, res: Response, next: NextFunction) => {
        const userId = res.locals.userId;

        const { newPassword, oldPassword } = req.body;

        //Checking new password
        const testPassword = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,100}/;
        if(!testPassword.test(newPassword)) {
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
        const {password} = req.body

        //Try to find user on database
        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail({where: {id: userId}});
        } catch (err) {
            return res.status(404).send({message: "User not found"});
        }

        //Checking password
        if(! await argon2.verify(user.password, password)) {
            return res.status(401).send({message: 'Incorrect password'});
        }

        try {
            await userRepository.delete({id: userId});
            await res.clearCookie('token');
        } catch (err) {
            next(err);
        }
        return res.status(204).send();
    }
}

export default UserController;