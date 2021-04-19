import jwt from "express-jwt";
import jsonWebToken from 'jsonwebtoken';
import {NextFunction, Request, Response} from "express";

export const authenticationJwt = jwt({
    secret: `${process.env.redis}`,
    algorithms: ["HS256"],
    getToken: req => req.cookies.token
});

export const getUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;
        const decoded = jsonWebToken.verify(token, `${process.env.redis}`);
        const userId = (<any>decoded).userId;
        if(userId) {
            res.locals.userId = userId;
            next();
        } else {
            throw new Error('Invalid token');
        }
    } catch (err) {
        next(err);
    }
}