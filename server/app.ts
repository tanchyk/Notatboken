import "reflect-metadata";
import {createConnection} from "typeorm";
import express, {Errback, Request, Response, Application, NextFunction} from 'express';

import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from "helmet";
import csurf from 'csurf';
import cookieParser from 'cookie-parser';

import usersRouter from "./routes/usersRouter";
import languageRouter from "./routes/languageRouter";
import {User} from "./entities/User";
import {Language} from "./entities/Language";
import {Card} from "./entities/Card";
import {Deck} from "./entities/Deck";
import decksRouter from "./routes/decksRouter";

const errorHandler = (err: Errback, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    return res.status(500).json({error: err});
}

// const setLanguages = async (connection: Connection) => {
//     const german = new Language();
//     german.languageName = 'German';
//     await connection.manager.save(german);
//
//     const french = new Language();
//     french.languageName = 'French';
//     await connection.manager.save(french);
//
//     const russian = new Language();
//     russian.languageName = 'Russian';
//     await connection.manager.save(russian);
//
//     const spanish = new Language();
//     spanish.languageName = 'Spanish';
//     await connection.manager.save(spanish);
//
//     const english = new Language();
//     english.languageName = 'English';
//     await connection.manager.save(english);
//
//     const norwegian = new Language();
//     norwegian.languageName = 'Norwegian';
//     await connection.manager.save(norwegian);
// }

createConnection({
    type: 'postgres',
    database: 'Notatboken',
    username: 'postgres',
    password: process.env.postgresPassword,
    logging: true,
    synchronize: true,
    entities: [User, Deck, Language, Card]
}).then(connection => {
    // setLanguages(connection);

    const app: Application = express();

    app.use(helmet());
    app.use(cors());
    app.use(express.urlencoded({
        extended: false
    }));
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(csurf({
        cookie: true
    }));
    app.use(errorHandler);

    app.get('/csrf-token', (req: Request, res: Response) => {
        res.json({ csrfToken: req.csrfToken() });
    });

    app.use('/users', usersRouter);
    app.use('/languages', languageRouter);
    app.use('/decks', decksRouter);

    const PORT = 5000;

    app.listen(PORT, () => {
        console.log(`PORT ${PORT}`)
    });
}).catch(error => console.log(error));