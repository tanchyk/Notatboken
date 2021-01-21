import {Response, Request} from 'express';
import {User} from "../entities/User";
import argon2 from "argon2";
import {validate} from "class-validator";
import {getRepository} from "typeorm";
import jwt from 'jsonwebtoken';

class AuthController {
    static login = async (req: Request, res: Response) => {
        const {usernameOrEmail, password} = req.body;
        console.log({usernameOrEmail, password});
        if (!(usernameOrEmail && password)) {
            return res.status(400).send();
        }

        //Search for user
        const userRepository = getRepository(User);
        let user: User;

        if(usernameOrEmail.includes('@')) {
            try {
                user = await userRepository.findOneOrFail({where: {email: usernameOrEmail}});
            } catch (e) {
                return res.status(401).send({message: 'Incorrect username/email or password'});
            }
        } else {
            try {
                user = await userRepository.findOneOrFail({where: {username: usernameOrEmail}});
            } catch (e) {
                return res.status(401).send({message: 'Incorrect username/email or password'});
            }
        }

        //Checking password
        if(! await argon2.verify(user.password, password)) {
            return res.status(401).send({message: 'Incorrect username/email or password'});
        }

        const token = jwt.sign(
            {userId: user.id},
            `${process.env.redis}`,
            {
                expiresIn: '24h',
                algorithm: "HS256"
            }
        )

        res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        return res.status(200).json({
            userId: user.id,
            username: user.username,
            email: user.email
        });
    }

    static register = async (req: Request, res: Response) => {
        const {username, email, password} = req.body;
        const user = new User();

        //Testing the input of a user
        const testEmail = /\S+@\S+\.\S+/;
        if(!testEmail.test(email) || email < 8 || email >= 254) {
            res.status(400).send({message: 'Invalid Email'});
            return;
        }

        const testPassword = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}/;
        if(!testPassword.test(password) || password > 64) {
            res.status(400).send({message: 'Password should contain at least one number, one lowercase and one uppercase letter'});
            return;
        }

        const testUsername = /\w/;
        if(!testUsername.test(username) || username < 3 || username > 64) {
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
            console.log(user)
            await userRepository.save(user);
        } catch (e) {
            res.status(409).send({message: 'Email is already in use'});
            return;
        }

        //If everything is fine, send 200 response
        const token = jwt.sign(
            {userId: user.id},
            `${process.env.redis}`,
            {
                expiresIn: '24h',
                algorithm: "HS256"
            }
        )

        res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        return res.status(200).json({
            userId: user.id,
            username: user.username,
            email: user.email
        });
    }

    //Logout
    static logout = async (req: Request, res: Response) => {
        await res.clearCookie('token');
        return res.redirect('/');
    }
}

export default AuthController;