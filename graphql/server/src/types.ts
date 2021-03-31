import {Request, Response} from "express";
import {Field, InputType, ObjectType} from "type-graphql";
import {User} from "./entities/User";

export interface MyContext {
    req: Request,
    res: Response
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