require("dotenv").config();
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { User } from "../entities/User";
import {
  ConfirmationResponse,
  EmailResponse,
  LoginInput,
  MyContext,
  RegisterInput,
  UserResponse,
} from "../utils/types/types";
import { getCustomRepository } from "typeorm";
import {
  COOKIE_NAME,
  FORGET_PASSWORD_PREFIX,
  REGISTER_PREFIX,
} from "../utils/types/constants";
import { sendEmailConformation } from "../utils/mailer";
import {
  testEmail,
  testPassword,
  testUsername,
} from "../middleware/validationMiddleware";
import { UserRepository } from "../repositories/UserRepository";
import { AuthService } from "../services/AuthService";
import { Service } from "typedi";

@Service()
@Resolver(User)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userRepository = getCustomRepository(UserRepository)
  ) {}

  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContext) {
    return this.authService.getMe(req.session.userId);
  }

  @Mutation(() => EmailResponse)
  @UseMiddleware(testEmail, testUsername, testPassword)
  async register(
    @Arg("input") input: RegisterInput,
    @Ctx() { redis }: MyContext
  ) {
    const userResponse = await this.authService.registerUser(input);

    if ("errors" in userResponse) {
      return userResponse;
    }
    return sendEmailConformation(userResponse, redis);
  }

  @Mutation(() => EmailResponse)
  @UseMiddleware(testEmail)
  async requestEmailConfirmation(
    @Arg("email") email: string,
    @Ctx() { redis }: MyContext
  ): Promise<EmailResponse> {
    const user = await this.userRepository.findUserByEmail(email);

    if (!user) {
      return {
        errors: null,
        send: true,
      };
    }

    return sendEmailConformation(user, redis);
  }

  @Mutation(() => ConfirmationResponse)
  async confirmRegistration(
    @Arg("token") token: string,
    @Ctx() { redis }: MyContext
  ): Promise<ConfirmationResponse> {
    const userId = await redis.get(REGISTER_PREFIX + token);

    const response = await this.authService.confirmUserRegistration(
      userId ? parseInt(userId) : null
    );

    if (response.errors) return response;

    await redis.del(REGISTER_PREFIX + token);

    return response;
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("input") input: LoginInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    if (!(input.usernameOrEmail && input.password)) {
      return {
        errors: [
          {
            field: "usernameOrEmail",
            message: "Incorrect data",
          },
        ],
        user: null,
      };
    }

    //Search for user
    const response = await this.authService.loginUser(input);

    if (response.errors) return response;

    req.session.userId = response.user.id;

    return response;
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise<boolean>((resolve) =>
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
          return resolve(false);
        } else {
          res.clearCookie(COOKIE_NAME);
          return resolve(true);
        }
      })
    );
  }

  @Mutation(() => EmailResponse)
  @UseMiddleware(testEmail)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { redis }: MyContext
  ): Promise<EmailResponse> {
    const user = await this.userRepository.findUserByEmail(email);

    if (!user) {
      return {
        errors: null,
        send: true,
      };
    }

    return this.authService.changeUserPassword(user, redis);
  }

  @Mutation(() => ConfirmationResponse)
  @UseMiddleware(testPassword)
  async resetPassword(
    @Arg("token") token: string,
    @Arg("password") password: string,
    @Ctx() { redis }: MyContext
  ): Promise<ConfirmationResponse> {
    const userId = await redis.get(FORGET_PASSWORD_PREFIX + token);

    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "Token has already expired",
          },
        ],
        confirmed: false,
      };
    }

    const response = await this.authService.resetUserPassword(
      parseInt(userId),
      password
    );

    if (response.errors) return response;

    await redis.del(FORGET_PASSWORD_PREFIX + token);

    return response;
  }
}
