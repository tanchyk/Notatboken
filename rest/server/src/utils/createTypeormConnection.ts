import { getConnectionOptions, createConnection } from "typeorm";
import {User} from "../entity/User";
import {Language} from "../entity/Language";
import {Card} from "../entity/Card";
import {Deck} from "../entity/Deck";
import {Folder} from "../entity/Folder";
import {CardChecked} from "../entity/CardChecked";
import {DayChecked} from "../entity/DayChecked";

export const createTypeormConnection = async () => {
    const connectionOptions = await getConnectionOptions(process.env.NODE_ENV === "test" ? "test" : "development");

    return createConnection({...connectionOptions, name: "default", entities: [User, Language, Card, Deck, Folder, CardChecked, DayChecked]})
};