import "reflect-metadata";
require('dotenv').config();
import express from "express";
import cors from "cors";
import {createConnection, getConnectionOptions} from "typeorm";
import {ApolloServer} from "apollo-server-express";
import { buildSchema } from "type-graphql";
import {MyContext} from "./types";
import {UserResolver} from "./resolvers/userResolver";

const app = async () => {
    const connOptions = await getConnectionOptions();
    await createConnection({...connOptions});

    const app = express();

    app.use(cors());

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver],
            validate: false
        }),
        context: ({res, req}: MyContext): MyContext => ({
            res,
            req
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