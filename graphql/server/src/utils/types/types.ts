import {Request, Response} from "express";
import {Field, InputType, Int, ObjectType} from "type-graphql";
import {User} from "../../entities/User";
import Redis from "ioredis";
import {Session, SessionData} from "express-session";
import {Deck} from "../../entities/Deck";

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

@InputType()
export class EditUserInput {
    @Field({nullable: true})
    name: string;
    @Field()
    username: string;
    @Field()
    email: string;
    @Field({nullable: true})
    avatarData: string;
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
    errors: FieldError[] | null;
    @Field(() => User, {nullable: true})
    user: User | null;
}

@ObjectType()
export class EmailResponse {
    @Field(() => [FieldError], {nullable: true})
    errors: FieldError[] | null;
    @Field(() => Boolean, {defaultValue: false})
    send: Boolean;
}

@ObjectType()
export class ConfirmationResponse {
    @Field(() => [FieldError], {nullable: true})
    errors: FieldError[] | null;
    @Field(() => Boolean, {defaultValue: false})
    confirmed: Boolean;
}

@ObjectType()
export class AddLanguageResponse {
    @Field(() => [FieldError], {nullable: true})
    errors: FieldError[] | null;
    @Field(() => Int, {defaultValue: 0})
    languageId: number;
}

export type Languages  = 'Polish' | 'German' | 'Russian' | 'Norwegian' | 'Spanish' | 'French';

@ObjectType()
export class DecksResponse {
    @Field(() => [FieldError], {nullable: true})
    errors: FieldError[] | null;
    @Field(() => [Deck], {nullable: true})
    decks: Deck[] | null;
}

@ObjectType()
export class SingleDeckResponse {
    @Field(() => [FieldError], {nullable: true})
    errors: FieldError[] | null;
    @Field(() => Deck, {nullable: true})
    deck: Deck | null;
}