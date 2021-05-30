import { Service } from "typedi";
import { getCustomRepository } from "typeorm";
import { CardRepository } from "../repositories/CardRepository";
import { DayCheckedRepository } from "../repositories/DayCheckRepository";
import { UserRepository } from "../repositories/UserRepository";
import { LanguageStatistics } from "../utils/types/types";

@Service()
export class StatisticService {
  private userRepository = getCustomRepository(UserRepository);
  private cardRepository = getCustomRepository(CardRepository);
  private dayCheckedRepo = getCustomRepository(DayCheckedRepository);

  async findLanguageStatistic(userId: number) {
    const user = await this.userRepository.findByIdWithLanguages(userId);

    if (!user) {
      return {
        errors: [
          {
            field: "userId",
            message: "User not found",
          },
        ],
        statistics: null,
      };
    }

    if (user.userLanguages.length === 0) {
      return {
        errors: [
          {
            field: "userId",
            message: "You have no languages",
          },
        ],
        statistics: null,
      };
    }
    const amountAry: LanguageStatistics[] = [];

    for (const lang of user.userLanguages) {
      amountAry.push({
        languageName: lang.languageName,
        amount: await this.cardRepository.countForLanugage(
          userId,
          lang.languageId
        ),
      });
    }

    return {
      errors: null,
      statistics: amountAry,
    };
  }

  async getStreak(userId: number) {
    let streak = 0;
    let today = false;

    const checkDays = await this.dayCheckedRepo.checkDays(userId);

    checkDays.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    if (checkDays.length === 0) {
      return {
        errors: null,
        statistics: {
          streak,
          today,
        },
      };
    }

    let date = new Date();

    if (
      checkDays[checkDays.length - 1].createdAt.toISOString().split("T")[0] ===
      date.toISOString().split("T")[0]
    ) {
      today = true;
      streak++;
      checkDays.pop();
    }
    date.setDate(date.getDate() - 1);

    for (let i = checkDays.length - 1; i >= 0; i--) {
      if (
        checkDays[i].createdAt.toISOString().split("T")[0] ===
        date.toISOString().split("T")[0]
      ) {
        date.setDate(date.getDate() - 1);
        streak++;
      } else {
        break;
      }
    }

    return {
      errors: null,
      statistics: {
        streak,
        today,
      },
    };
  }
}
