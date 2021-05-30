import { Service } from "typedi";
import { getRepository, getCustomRepository } from "typeorm";
import { Language } from "../entities/Language";
import { UserRepository } from "../repositories/UserRepository";

@Service()
export class LanguageService {
  private languageRepository = getRepository(Language);
  private userRepository = getCustomRepository(UserRepository);

  async addLanuageToUser(userId: number, language: string) {
    const user = await this.userRepository.findByIdWithLanguages(userId);

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
