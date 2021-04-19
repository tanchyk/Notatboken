import {EmailResponse, FieldError} from "../types/types";
require('dotenv').config();
import nodemailer from "nodemailer";
import Redis from "ioredis";
import {v4} from "uuid";
import {CHANGE_EMAIL_PREFIX, REGISTER_PREFIX} from "../types/constants";
import {User} from "../entities/User";

export const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: `${process.env.GMAIL_USER}`,
        pass: `${process.env.GMAIL_PASS}`,
    },
});

export const sendEmailConformation = async (user: User, redis: Redis.Redis): Promise<EmailResponse> => {
    try {
        const token = v4();
        await redis.set(
            REGISTER_PREFIX + token,
            user.id,
            "ex",
            1000*60*60*24
        );

        const url = `${process.env.CORS_ORIGIN}/confirm-email/${token}`;

        await transporter.sendMail({
            from: `${process.env.GMAIL_USER}`,
            to: user.email,
            subject: "Confirm email for Notatboken",
            html: `
                    <div style="margin: 40px; padding: 40px; border: 1px solid #4A5568; border-radius: 0.5rem; display: flex; flex-direction: row; flex-wrap: wrap;">
                        <div style="padding: 40px;">
                            <img style="width: 200px; height: 200px;" src="https://res.cloudinary.com/dw3hb6ec8/image/upload/v1614424748/mainpage/forgot_password_pcnkfd.png" />
                        </div>
                        <div style="padding: 40px;">
                            <h1>Please click this link to confirm your email: </h1>
                            <a href="${url}">Confirm Email</a>
                        </div>
                    </div>
                `
        })
    } catch (e) {
        console.log(e);
        return {
            errors: [{
                field: "token",
                message: "Ops, for some reason we can't send you an email"
            }],
            send: false
        }
    }

    return {
        errors: null,
        send: true
    };
}

export const changeEmailConformation = async (user: User, email: string, redis: Redis.Redis): Promise<{errors: FieldError[] | null}> => {
    try {
        const token = v4();
        await redis.set(
            CHANGE_EMAIL_PREFIX + `${user.id}` + token,
            email,
            "ex",
            1000*60*60*24
        );

        const url = `${process.env.CORS_ORIGIN}/account/${token}`;

        await transporter.sendMail({
            from: `${process.env.GMAIL_USER}`,
            to: email,
            subject: "Confirm email change",
            html: `
                    <div style="margin: 40px; padding: 40px; border: 1px solid #4A5568; border-radius: 0.5rem; display: flex; flex-direction: row; flex-wrap: wrap;">
                        <div style="padding: 40px;">
                            <img style="width: 200px; height: 200px;" src="https://res.cloudinary.com/dw3hb6ec8/image/upload/v1614424748/mainpage/forgot_password_pcnkfd.png" />
                        </div>
                        <div style="padding: 40px;">
                            <h1>Please click this link to confirm your email: </h1>
                            <a href="${url}">Confirm Email</a>
                        </div>
                    </div>
                `
        })
    } catch (e) {
        console.log(e);
        return {
            errors: [{
                field: "token",
                message: "Ops, for some reason we can't send you an email"
            }]
        }
    }

    return {
        errors: null
    };
}