import "reflect-metadata";
import {createConnection} from "typeorm";
import express, {Errback, Request, Response, NextFunction, Application} from 'express';

import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from "helmet";

import usersRouter from "./routes/usersRouter";
import notesRouter from "./routes/notesRouter";
import {User} from "./entities/User";
import {Note} from "./entities/Note";

const errorHandler = (err: Errback, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).json({error: err});
}

createConnection({
    type: 'postgres',
    database: 'Notatboken',
    username: 'postgres',
    password: process.env.postgresPassword,
    logging: true,
    synchronize: true,
    entities: [User, Note]
}).then(connection => {
    const app: Application = express();

    app.use(helmet());
    app.use(cors());
    app.use(express.urlencoded({extended: false}))
    app.use(bodyParser.json());
    app.use(errorHandler);

    app.use('/users', usersRouter);
    app.use('/posts', notesRouter);

    const PORT = 5000;

    app.listen(PORT, () => {
        console.log(`PORT ${PORT}`)
    });
}).catch(error => console.log(error));