import {Request, Response} from "express";
import {Field, InputType, ObjectType} from "type-graphql";
import {User} from "../entities/User";
import Redis from "ioredis";
import {Session, SessionData} from "express-session";

export interface MyContext {
    req: Request & {session: Session & Partial<SessionData> & {userId: number}},
    res: Response,
    redis: Redis.Redis
}

@InputType()
export class RegisterInput {
    @Field()
    username: string;
    @Field()
    email: string;
    @Field()
    password: string;
}

@InputType()
export class LoginInput {
    @Field()
    usernameOrEmail: string;
    @Field()
    password: string;
}

@ObjectType()
export class FieldError {
    @Field()
    field: string;
    @Field()
    message: string;
}

@ObjectType()
export class UserResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[];
    @Field(() => User, {nullable: true})
    user?: User;
}

@ObjectType()
export class EmailResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[];
    @Field(() => Boolean, {defaultValue: false})
    send: Boolean;
}