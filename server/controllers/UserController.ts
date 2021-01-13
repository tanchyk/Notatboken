import {Response, Request} from 'express';
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import argon2 from 'argon2';

import {User} from "../entities/User";

class UserController {
    static allUsers = async (req: Request, res: Response) => {

    }

    static singleUser = async (req: Request, res: Response) => {

    }

    static newUser = async (req: Request, res: Response) => {
        const {username, email, password} = req.body;
        const user = new User();

        //Testing the input of a user
        const testEmail = /\S+@\S+\.\S+/;
        if(!testEmail.test(email)) {
            res.status(400).send({message: 'Invalid Email'});
            return;
        }

        const testPassword = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}/;
        if(!testPassword.test(password)) {
            res.status(400).send({message: 'Password should contain at least one number, one lowercase and one uppercase letter'});
            return;
        }

        const testUsername = /\w/;
        if(!testUsername.test(username)) {
            res.status(400).send({message: 'Invalid Username'});
            return;
        }

        //Creating User
        const hashedPassword = await argon2.hash(password);

        user.username = username;
        user.email = email;
        user.password = hashedPassword;

        //Validate if the parameters are ok
        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        const userRepository = getRepository(User);
        try {
            await userRepository.save(user);
        } catch (e) {
            res.status(409).send({message: 'Email is already in use'});
            return;
        }

        //If everything is fine, send 201 response
        res.status(201).send({ message: "User created"});
    }

    static editUser = async (req: Request, res: Response) => {

    }

    static deleteUser = async (req: Request, res: Response) => {

    }
}

export default UserController;