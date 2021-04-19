import "reflect-metadata";
require('dotenv').config();
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import {createConnection, getConnectionOptions} from "typeorm";
import {ApolloServer} from "apollo-server-express";
import { buildSchema } from "type-graphql";
import {MyContext} from "./types/types";
import {AuthResolver} from "./resolvers/authResolver";

import session from "express-session";
import connectRedis from "connect-redis";
import Redis from "ioredis";
import {COOKIE_NAME} from "./types/constants";
import {UserResolver} from "./resolvers/userResolver";

const app = async () => {
    const connOptions = await getConnectionOptions();
    await createConnection({...connOptions});

    const app = express();

    const RedisClient = connectRedis(session);
    const redis = new Redis();

    app.use(cors({
        origin: `${process.env.CORS_ORIGIN}`,
        credentials: true
    }));

    app.use(bodyParser({limit: '10mb'}));

    app.use(
        session({
            name: COOKIE_NAME,
            store: new RedisClient({
                client: redis,
                disableTouch: true
            }),
            cookie: {
                maxAge: 1000*60*60*24*90,
                httpOnly: true,
                sameSite: "lax",
                secure: false
            },
            saveUninitialized: false,
            secret: `${process.env.REDIS_SECRET}`,
            resave: false
        })
    )

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [AuthResolver, UserResolver],
            validate: false
        }),
        context: ({res, req}: MyContext): MyContext => ({
            res,
            req,
            redis
        })
    })

    apolloServer.applyMiddleware({
        app,
        cors: false
    })

    app.listen(`${process.env.PORT}`, () => {
        console.log("Server: ", `http://localhost:${process.env.PORT}/graphql`);
    })
}

app();