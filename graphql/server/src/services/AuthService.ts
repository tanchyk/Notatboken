import { Service } from "typedi";
import { getCustomRepository } from "typeorm";
import { User } from "../entities/User";
import { UserRepository } from "../repositories/UserRepository";
import { LoginInput, RegisterInput } from "../utils/types/types";
import argon2 from "argon2";
import { v4 } from "uuid";
import Redis from "ioredis";
import { transporter } from "../utils/mailer";
import { FORGET_PASSWORD_PREFIX } from "../utils/types/constants";

@Service()
export class AuthService {
  private readonly userRepository = getCustomRepository(UserRepository);

  getMe(userId: number) {
    if (!userId) {
      return null;
    } else {
      return this.userRepository.findByIdWithLanguages(userId);
    }
  }

  async registerUser(input: RegisterInput) {
    const checkExisting: User | undefined =
      await this.userRepository.findUserByEmailOrUsername(
        input.email,
        input.username
      );

    if (checkExisting && checkExisting!.username === input.username) {
      return {
        errors: [
          {
            field: "username",
            message: "Username is already taken",
          },
        ],
        send: false,
      };
    } else if (checkExisting && checkExisting!.email === input.email) {
      return {
        errors: [
          {
            field: "email",
            message: "Email is already taken",
          },
        ],
        send: false,
      };
    }

    const user = new User();
    user.username = input.username;
    user.email = input.email;
    user.password = await argon2.hash(input.password);

    try {
      await this.userRepository.save(user);
    } catch (e) {
      return {
        errors: [
          {
            field: "email",
            message: "Email is already in use",
          },
        ],
        send: false,
      };
    }

    return user;
  }

  async loginUser(input: LoginInput) {
    const incorrectUsernameOrEmail = {
      errors: [
        {
          field: "usernameOrEmail",
          message: "Incorrect username/email or password",
        },
      ],
      user: null,
    };

    const user = input.usernameOrEmail.includes("@")
      ? await this.userRepository.findUserByEmail(input.usernameOrEmail)
      : await this.userRepository.findUserByUsername(input.usernameOrEmail);

    if (!user) {
      return incorrectUsernameOrEmail;
    }

    if (!user.confirmed) {
      return {
        errors: [
          {
            field: "usernameOrEmail",
            message: "Please, confirm your email",
          },
        ],
        user: null,
      };
    }

    //Checking password
    if (!(await argon2.verify(user.password, input.password))) {
      return incorrectUsernameOrEmail;
    }

    return {
      errors: null,
      user,
    };
  }

  async confirmUserRegistration(userId: number | null) {
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

    const user = await this.userRepository.findUserById(userId);

    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "User no longer exists",
          },
        ],
        confirmed: false,
      };
    }

    user.confirmed = true;
    await this.userRepository.save(user);

    return {
      errors: null,
      confirmed: true,
    };
  }

  async changeUserPassword(user: User, redis: Redis.Redis) {
    try {
      const token = v4();
      await redis.set(
        FORGET_PASSWORD_PREFIX + token,
        user.id,
        "ex",
        1000 * 60 * 60 * 24
      );

      const url = `${process.env.CORS_ORIGIN}/change-password/${token}`;

      await transporter.sendMail({
        from: `${process.env.GMAIL_USER}`,
        to: user.email,
        subject: "Change Password",
        html: `
                    <div style="margin: 40px; padding: 40px; border: 1px solid #4A5568; border-radius: 0.5rem; display: flex; flex-direction: row; flex-wrap: wrap;">
                        <div style="padding: 40px;">
                            <img style="width: 200px; height: 200px;" src="https://res.cloudinary.com/dw3hb6ec8/image/upload/v1614425565/mainpage/change_password_mr16nb.png" />
                        </div>
                        <div style="padding: 40px;">
                            <h1>Please click this link to change your password: </h1>
                            <a href="${url}">Change Password</a>
                        </div>
                    </div>
                `,
      });

      return {
        errors: null,
        send: true,
      };
    } catch (e) {
      console.log(e);
      return {
        errors: [
          {
            field: "email",
            message: "Ooops, something wrong with our service",
          },
        ],
        send: false,
      };
    }
  }

  async resetUserPassword(userId: number, password: string) {
    const user = await this.userRepository.findUserById(userId);

    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "User no longer exists",
          },
        ],
        confirmed: false,
      };
    }

    user.password = await argon2.hash(password);
    await this.userRepository.save(user);

    return {
      errors: null,
      confirmed: true,
    };
  }
}
