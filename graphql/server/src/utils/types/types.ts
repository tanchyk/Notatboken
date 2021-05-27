import { Request, Response } from "express";
import { Field, InputType, Int, ObjectType } from "type-graphql";
import { User } from "../../entities/User";
import Redis from "ioredis";
import { Session, SessionData } from "express-session";
import { Deck } from "../../entities/Deck";
import { Card } from "../../entities/Card";

export interface MyContext {
  req: Request & {
    session: Session & Partial<SessionData> & { userId: number };
  };
  res: Response;
  redis: Redis.Redis;
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
  @Field({ nullable: true })
  name: string;
  @Field()
  username: string;
  @Field()
  email: string;
  @Field({ nullable: true })
  avatarData: string;
}

@ObjectType()
export class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

class FieldErrors {
  @Field(() => [FieldError], { nullable: true })
  errors: FieldError[] | null;
}

@ObjectType()
export class UserResponse extends FieldErrors {
  @Field(() => User, { nullable: true })
  user: User | null;
}

@ObjectType()
export class EmailResponse extends FieldErrors {
  @Field(() => Boolean, { defaultValue: false })
  send: Boolean;
}

@ObjectType()
export class ConfirmationResponse extends FieldErrors {
  @Field(() => Boolean, { defaultValue: false })
  confirmed: Boolean;
}

@ObjectType()
export class AddLanguageResponse extends FieldErrors {
  @Field(() => Int, { defaultValue: 0 })
  languageId: number;
}

export type Languages =
  | "Polish"
  | "German"
  | "Russian"
  | "Norwegian"
  | "Spanish"
  | "French";

@ObjectType()
export class DecksResponse extends FieldErrors {
  @Field(() => [Deck], { nullable: true })
  decks: Deck[] | null;
}

@ObjectType()
export class SingleDeckResponse extends FieldErrors {
  @Field(() => Deck, { nullable: true })
  deck: Deck | null;
}

@ObjectType()
export class CardsResponse extends FieldErrors {
  @Field(() => [Card], { nullable: true })
  cards: Card[] | null;
}

@ObjectType()
export class SingleCardResponse extends FieldErrors {
  @Field(() => Card, { nullable: true })
  card: Card | null;
}

export type ProficiencyType =
  | "fail"
  | "repeat"
  | "1d"
  | "3d"
  | "7d"
  | "21d"
  | "31d"
  | "90d"
  | "learned";
