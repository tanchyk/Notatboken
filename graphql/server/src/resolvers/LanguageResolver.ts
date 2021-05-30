import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { AddLanguageResponse, MyContext } from "../utils/types/types";
import { isAuth } from "../middleware/isAuth";
import { Language } from "../entities/Language";
import { getCustomRepository, getRepository } from "typeorm";
import { UserRepository } from "../repositories/UserRepository";

@Resolver()
export class LanguageResolver {
  private languageRepository = getRepository(Language);
  private userRepository = getCustomRepository(UserRepository);

  @Mutation(() => AddLanguageResponse)
  @UseMiddleware(isAuth)
  async addLanguage(
    @Arg("language") language: string,
    @Ctx() { req }: MyContext
  ): Promise<AddLanguageResponse> {
    //Finding user
    const user = await this.userRepository.findByIdWithLanguages(
      req.session.userId
    );

    if (!user) {
      return {
        errors: [
          {
            field: "language",
            message: "User not found",
          },
        ],
        languageId: 0,
      };
    }

    if (user.userLanguages.length >= 3) {
      return {
        errors: [
          {
            field: "language",
            message: "Sorry, Notatboken cant add more languages for you",
          },
        ],
        languageId: 0,
      };
    }

    //Finding language
    const languageUser = await this.languageRepository.findOne({
      where: { languageName: language },
    });

    if (!languageUser) {
      return {
        errors: [
          {
            field: "language",
            message: "Sorry, Notatboken cant add this language for you yet",
          },
        ],
        languageId: 0,
      };
    }

    //Checking picked language
    if (
      user.userLanguages.some(
        (language) => language.languageId === languageUser.languageId
      )
    ) {
      return {
        errors: [
          {
            field: "language",
            message: "You already have this language",
          },
        ],
        languageId: 0,
      };
    }

    //Saving to a user
    user.userLanguages.push(languageUser);
    await this.userRepository.save(user);

    return {
      errors: null,
      languageId: languageUser.languageId,
    };
  }
}
