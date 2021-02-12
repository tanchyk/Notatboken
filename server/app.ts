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
import cardsRouter from "./routes/cardRoutes";

const errorHandler = (err: Errback, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    return res.status(500).json({error: err});
}

// const setLanguages = async (connection: Connection) => {
//     const languages = ['Polish', 'German', 'Russian', 'Norwegian', 'Spanish', 'French'];
//
//     for(const language of languages) {
//         const insertLang = new Language();
//         insertLang.languageName = language;
//         await connection.manager.save(insertLang);
//     }
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
    app.use('/cards', cardsRouter);

    const PORT = 5000;

    app.listen(PORT, () => {
        console.log(`PORT ${PORT}`)
    });
}).catch(error => console.log(error));