import {Response, Request, NextFunction} from 'express';

export const testEmail = (req: Request, res: Response, next: NextFunction): void | Response => {
    const {email} = req.body;

    const test = /\S+@\S+\.\S+/;
    if(!test.test(email) || email.length < 8 || email.length >= 254) {
        return res.status(400).send({message: 'Invalid Email'});
    } else {
        next();
    }
}

export const testPassword = (req: Request, res: Response, next: NextFunction): void | Response => {
    const {password} = req.body;

    const test = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,100}/;
    if(!test.test(password)) {
        return res.status(400).send({message: 'Password should contain at least one number, one lowercase and one uppercase letter'});
    } else {
        next();
    }
}

export const testUsername = (req: Request, res: Response, next: NextFunction): void | Response => {
    const {username} = req.body;

    const test = /^(?=.{3,64}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
    if(!test.test(username)) {
        return res.status(400).send({message: 'Invalid Username'});
    } else {
        next();
    }
}

export const testName = (req: Request, res: Response, next: NextFunction): void | Response => {
    const {name} = req.body;

    const testName = /^([a-zA-Z]{2,}\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z]{1,})?)/i;
    if (!testName.test(name) || name.length < 5) {
        return res.status(400).send({message: 'Invalid Name'});
    } else {
        next();
    }
}

export const testCard = (req: Request, res: Response, next: NextFunction): void | Response => {
    const {foreignWord,nativeWord} = req.body;

    const testCard = /^(?=.{1,84}$)[A-ZА-ЯЁa-zа-яё0-9äöüßÄÖÜæÆøØåÅ,;\s]+[A-ZА-ЯЁa-zа-яё0-9äöüßÄÖÜæÆøØåÅ.?!]$/;
    if (!testCard.test(foreignWord) || !testCard.test(nativeWord)) {
        return res.status(400).send({message: "Please, enter a valid word or a sentence"});
    } else {
        next();
    }
}