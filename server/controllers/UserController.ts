import {Response, Request, NextFunction} from 'express';
import {getRepository} from "typeorm";
import {User} from "../entities/User";
// import { validate } from "class-validator";
// import argon2 from 'argon2';

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