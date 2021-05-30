import { Service } from "typedi";
import { getCustomRepository } from "typeorm";
import { UserRepository } from "../repositories/UserRepository";
import { changeEmailConformation } from "../utils/mailer";
import { EditUserInput } from "../utils/types/types";
import Redis from "ioredis";
import argon2 from "argon2";

const cloudinary = require("cloudinary").v2;

@Service()
export class UserService {
  private userRepository = getCustomRepository(UserRepository);

  async editUser(userId: number, input: EditUserInput, redis: Redis.Redis) {
    const user = await this.userRepository.findByIdWithLanguages(userId);

    if (!user) {
      return {
        errors: [
          {
            field: "user",
            message: "User does not exists",
          },
        ],
        user: null,
      };
    }
    //Checking if data already in database
    const checkExisting = await this.userRepository.findUserByEmailOrUsername(
      input.email,
      input.username
    );

    if (
      checkExisting &&
      checkExisting!.username === input.username &&
      checkExisting!.username !== user.username
    ) {
      return {
        errors: [
          {
            field: "username",
            message: "Username is already taken",
          },
        ],
        user: null,
      };
    } else if (
      checkExisting &&
      checkExisting!.email === input.email &&
      checkExisting!.email !== user.email
    ) {
      return {
        errors: [
          {
            field: "email",
            message: "Email is already taken",
          },
        ],
        user: null,
      };
    }

    if (input.email !== user.email) {
      const response = await changeEmailConformation(user, input.email, redis);
      if (response.errors) {
        return {
          errors: response.errors,
          user: null,
        };
      }
    }

    if (input.avatarData && input.avatarData !== user.avatar) {
      try {
        await cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_KEY,
          api_secret: process.env.CLOUDINARY_SECRET,
        });

        const uploadResponse = await cloudinary.uploader.upload_large(
          input.avatarData,
          {
            upload_presets: "user_avatar",
            resource_type: "image",
            chunk_size: 5000000,
            transformation: [
              { width: 400, height: 400, gravity: "face", crop: "thumb" },
            ],
          }
        );
        user.avatar = uploadResponse.secure_url;
      } catch (e) {
        console.log("Error", e);
      }
    }

    user.name = input.name;
    user.username = input.username;

    //Try to save, if it fails, that means username or email already in use
    try {
      await this.userRepository.save(user);
    } catch (e) {
      return {
        errors: [
          {
            field: "username",
            message: "Username is already in use",
          },
        ],
        user: null,
      };
    }

    return {
      errors: null,
      user: user,
    };
  }

  async confirmEmailChange(userId: number, email: string) {
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

    user.email = email;
    await this.userRepository.save(user);

    return {
      errors: null,
      confirmed: true,
    };
  }

  async changeUserPassword(
    userId: number,
    newPassword: string,
    oldPassword: string
  ) {
    //Try to find user on database
    const user = await this.userRepository.findUserById(userId);

    if (!user) {
      return {
        errors: [
          {
            field: "newPassword",
            message: "User is not exists",
          },
        ],
        confirmed: false,
      };
    }

    //Checking password
    if (!(await argon2.verify(user.password, oldPassword))) {
      return {
        errors: [
          {
            field: "oldPassword",
            message: "Incorrect password",
          },
        ],
        confirmed: false,
      };
    }

    if (newPassword === oldPassword) {
      return {
        errors: [
          {
            field: "newPassword",
            message: "Please, change your password",
          },
        ],
        confirmed: false,
      };
    }

    user.password = await argon2.hash(newPassword);
    await this.userRepository.save(user);

    return {
      errors: null,
      confirmed: true,
    };
  }

  async editUserGoal(userId: number, userGoal: number) {
    const user = await this.userRepository.findUserById(userId);

    if (!user) {
      return {
        errors: [
          {
            field: "userGoal",
            message: "User is not exists",
          },
        ],
        confirmed: false,
      };
    }

    if (
      userGoal === 5 ||
      userGoal === 10 ||
      userGoal === 15 ||
      userGoal === 20
    ) {
      user.userGoal = userGoal;
      await this.userRepository.save(user);
    }

    return {
      errors: null,
      confirmed: true,
    };
  }

  async deleteUser(userId: number, password: string) {
    const user = await this.userRepository.findUserById(userId);

    if (!user) {
      return {
        errors: [
          {
            field: "password",
            message: "User is not exists",
          },
        ],
        confirmed: false,
      };
    }

    //Checking password
    if (!(await argon2.verify(user.password, password))) {
      return {
        errors: [
          {
            field: "password",
            message: "Incorrect password",
          },
        ],
        confirmed: false,
      };
    }

    await this.userRepository.delete({ id: userId });

    return {
      errors: null,
      confirmed: true,
    };
  }
}
