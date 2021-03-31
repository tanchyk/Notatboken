import "reflect-metadata";
require('dotenv').config();
import express, {Errback, Request, Response, Application, NextFunction} from 'express';

import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from "helmet";
import csurf from 'csurf';
import cookieParser from 'cookie-parser';

import usersRouter from "./routes/usersRouter";
import languageRouter from "./routes/languageRouter";
import decksRouter from "./routes/decksRouter";
import cardsRouter from "./routes/cardRoutes";
import foldersRouter from "./routes/folderRoutes";
import statisticsRouter from "./routes/statisticsRoutes";

import {Connection, getRepository} from "typeorm";
import {Language} from "./entity/Language";
import {createTypeormConnection} from "./utils/createTypeormConnection";


const errorHandler = (err: Errback, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    return res.status(500).json({error: err});
}

export const setLanguages = async (connection: Connection) => {
    const languages = ['Polish', 'German', 'Russian', 'Norwegian', 'Spanish', 'French'];

    for(const language of languages) {
        const insertLang = new Language();
        insertLang.languageName = language;
        await connection.manager.save(insertLang);
    }
}

export const app: Application = express();

const start = async () => {
    if (process.env.NODE_ENV !== "test") {
        const connection = await createTypeormConnection();
        const languageRepository = getRepository(Language);
        if(await languageRepository.count() === 0) {
            await setLanguages(connection);
        }
    }

    app.use(helmet());
    app.use(cors({
        origin: ['https://notatboken.com', 'https://www.notatboken.com'],
        credentials: true
    }));
    app.use(express.urlencoded({
        extended: false
    }));
    app.use(bodyParser.json());
    app.use(cookieParser());
    if(process.env.NODE_ENV !== 'test') {
        app.use(csurf({
                cookie: {sameSite: 'none', secure: true}
            })
        );
        app.get('/csrf-token', (req: Request, res: Response) => {
            res.json({csrfToken: req.csrfToken()});
        });
    }
    app.use(errorHandler);

    app.use('/users', usersRouter);
    app.use('/languages', languageRouter);
    app.use('/decks', decksRouter);
    app.use('/cards', cardsRouter);
    app.use('/folders', foldersRouter);
    app.use('/statistics', statisticsRouter);
}

start();

const PORT = 5000;

export const server = app.listen(PORT, () => {
    if (process.env.NODE_ENV !== "test") {
        console.log(`PORT ${PORT}`)
    }
});