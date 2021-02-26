import {transporter} from "../middleware/nodemailer";

require('dotenv').config();
import {Response, Request} from 'express';
import {User} from "../entities/User";
import argon2 from "argon2";
import {getRepository} from "typeorm";
import jwt from 'jsonwebtoken';

class AuthController {
    static login = async (req: Request, res: Response) => {
        const {usernameOrEmail, password} = req.body;

        if (!(usernameOrEmail && password)) {
            return res.status(400).send();
        }

        //Search for user
        const userRepository = getRepository(User);
        let user: User;

        if(usernameOrEmail.includes('@')) {
            try {
                user = await userRepository.findOneOrFail({ relations: ["userLanguages"], where: {email: usernameOrEmail}});
            } catch (e) {
                return res.status(401).send({message: 'Incorrect username/email or password'});
            }
        } else {
            try {
                user = await userRepository.findOneOrFail({ relations: ["userLanguages"], where: {username: usernameOrEmail}});
            } catch (e) {
                return res.status(401).send({message: 'Incorrect username/email or password'});
            }
        }

        if(!user.confirmed) {
            return res.status(401).send({message: 'Please, confirm your email'});
        }

        //Checking password
        if(! await argon2.verify(user.password, password)) {
            return res.status(401).send({message: 'Incorrect username/email or password'});
        }

        const token = jwt.sign(
            {userId: user.id},
            `${process.env.redis}`,
            {
                expiresIn: '120h',
                algorithm: "HS256"
            }
        )

        res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        return res.status(200).json({
            userId: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            languages: user.userLanguages,
            userGoal: user.userGoal,
            avatar: user.avatar,
            createdAt: user.createdAt
        });
    }

    static register = async (req: Request, res: Response) => {
        const {username, email, password} = req.body;
        const user = new User();

        //Creating User
        const hashedPassword = await argon2.hash(password);

        user.username = username;
        user.email = email;
        user.password = hashedPassword;

        const userRepository = getRepository(User);

        const checkExisting: User | undefined = await userRepository.findOne({
            where : [{
                username : username,
            }, {
                email : email,
            }]
        });

        if(checkExisting && checkExisting!.username === username) {
            return res.status(409).send({message: 'Username is already taken'});
        } else if(checkExisting && checkExisting!.email === email) {
            return res.status(409).send({message: 'Email is already taken'});
        }

        try {
            await userRepository.save(user);
        } catch (e) {
            return res.status(409).send({message: 'Email is already in use'});;
        }

        jwt.sign(
            {
                userId: user.id
            },
            `${process.env.CONF_SECRET}`,
            {
                expiresIn: '1d',
            },
            (err, emailToken) => {
                const url = `http://localhost:5000/users/confirmation/${emailToken}`;

                transporter.sendMail({
                    from: `${process.env.GMAIL_USER}`,
                    to: user.email,
                    subject: 'Confirm Your Email',
                    html: `
                    <div style="margin: 40px; padding: 40px; border: 1px solid #4A5568; border-radius: 0.5rem; display: flex; flex-direction: row; flex-wrap: wrap;">
                        <div style="padding: 40px;">
                            <img style="width: 200px; height: 200px;" src="https://res.cloudinary.com/dw3hb6ec8/image/upload/v1614341776/notatboken/speaker_ojkkan.png" />
                        </div>
                        <div style="padding: 40px;">
                            <h1>Please click this link to confirm your email: </h1>
                            <a href="${url}">${url}</a>
                        </div>
                    </div>
                    `,
                });
            },
        );

        return res.status(200).send({message: 'Created'})

        // //If everything is fine, send 200 response
        // const token = jwt.sign(
        //     {userId: user.id},
        //     `${process.env.redis}`,
        //     {
        //         expiresIn: '24h',
        //         algorithm: "HS256"
        //     }
        // )
        //
        // res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        // return res.status(200).json({
        //     userId: user.id,
        //     name: user.name,
        //     username: user.username,
        //     email: user.email,
        //     userGoal: user.userGoal,
        //     avatar: user.avatar,
        //     createdAt: user.createdAt
        // });
    }

    static verifyRegistration = async (req: Request, res: Response) => {
        try {
            const decoded = jwt.verify(req.params.token, `${process.env.CONF_SECRET}`);

            const userRepository = getRepository(User);
            let user: User;

            user = await userRepository.findOneOrFail({where: {id: (<any>decoded).userId}});
            user.confirmed = true;
            await userRepository.save(user);

            return res.redirect('http://localhost:4020/login')
        } catch (e) {
            res.send('error');
        }
    }

    //Logout
    static logout = async (req: Request, res: Response) => {
        await res.clearCookie('token');
        return res.redirect('/');
    }
}

export default AuthController;