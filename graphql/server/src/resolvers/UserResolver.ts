import { Arg, Ctx, Int, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { User } from "../entities/User";
import {
  ConfirmationResponse,
  EditUserInput,
  MyContext,
  UserResponse,
} from "../utils/types/types";
import { isAuth } from "../middleware/isAuth";
import {
  testEmail,
  testName,
  testPassword,
  testUsername,
} from "../middleware/validationMiddleware";
import { CHANGE_EMAIL_PREFIX, COOKIE_NAME } from "../utils/types/constants";
import { UserService } from "../services/UserService";
import { Service } from "typedi";

@Service()
@Resolver(User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => UserResponse)
  @UseMiddleware(isAuth, testUsername, testEmail, testName)
  editUser(
    @Arg("input") input: EditUserInput,
    @Ctx() { req, redis }: MyContext
  ): Promise<UserResponse> {
    return this.userService.editUser(req.session.userId, input, redis);
  }

  @Mutation(() => ConfirmationResponse)
  @UseMiddleware(isAuth)
  async confirmEmailChange(
    @Arg("token") token: string,
    @Ctx() { req, redis }: MyContext
  ): Promise<ConfirmationResponse> {
    const email = await redis.get(
      CHANGE_EMAIL_PREFIX + `${req.session.userId}` + token
    );

    if (!email) {
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

    const response = await this.userService.confirmEmailChange(
      req.session.userId,
      email
    );

    if (response.errors) return response;

    await redis.del(CHANGE_EMAIL_PREFIX + `${req.session.userId}` + token);

    return response;
  }

  @Mutation(() => ConfirmationResponse)
  @UseMiddleware(isAuth)
  async changePassword(
    @Arg("newPassword") newPassword: string,
    @Arg("oldPassword") oldPassword: string,
    @Ctx() { req }: MyContext
  ): Promise<ConfirmationResponse> {
    const testPassword = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,100}/;
    if (!testPassword.test(newPassword)) {
      return {
        errors: [
          {
            field: "newPassword",
            message:
              "Password should contain at least one number, one lowercase and one uppercase letter",
          },
        ],
        confirmed: false,
      };
    }

    return this.userService.changeUserPassword(
      req.session.userId,
      newPassword,
      oldPassword
    );
  }

  @Mutation(() => ConfirmationResponse)
  @UseMiddleware(isAuth)
  editGoal(
    @Arg("userGoal", () => Int) userGoal: number,
    @Ctx() { req }: MyContext
  ): Promise<ConfirmationResponse> {
    return this.userService.editUserGoal(req.session.userId, userGoal);
  }

  @Mutation(() => ConfirmationResponse)
  @UseMiddleware(isAuth, testPassword)
  async deleteUser(
    @Arg("password") password: string,
    @Ctx() { req, res }: MyContext
  ): Promise<ConfirmationResponse> {
    const response = await this.userService.deleteUser(
      req.session.userId,
      password
    );

    if (response.errors) return response;

    await res.clearCookie(COOKIE_NAME);

    return response;
  }
}
