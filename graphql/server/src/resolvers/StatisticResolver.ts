import { Query, UseMiddleware, Ctx, Resolver } from "type-graphql";
import { getCustomRepository } from "typeorm";
import { isAuth } from "../middleware/isAuth";
import { CardCheckedRepository } from "../repositories/CardCheckedRepository";
import { CardRepository } from "../repositories/CardRepository";
import { DayCheckedRepository } from "../repositories/DayCheckRepository";
import { UserRepository } from "../repositories/UserRepository";
import {
  UserProgressResponse,
  LanguageStatistics,
  LanguageStatResponse,
  MyContext,
  UserStreakResponse,
  CardDayResponse,
  CardWeekResponse,
} from "../utils/types/types";

@Resolver()
export class StatisticResolver {
  private userRepository = getCustomRepository(UserRepository);
  private cardRepository = getCustomRepository(CardRepository);
  private dayCheckedRepo = getCustomRepository(DayCheckedRepository);
  private cardCheckedRepo = getCustomRepository(CardCheckedRepository);

  @Query(() => LanguageStatResponse)
  @UseMiddleware(isAuth)
  async findDecks(@Ctx() { req }: MyContext): Promise<LanguageStatResponse> {
    const userId = req.session.userId;

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

  @Query(() => UserProgressResponse)
  @UseMiddleware(isAuth)
  async getUserProgress(
    @Ctx() { req }: MyContext
  ): Promise<UserProgressResponse> {
    const userId = req.session.userId;

    const amountOfCards = await this.cardRepository.countForUser(userId);

    const amountOfCardsLearned = await this.cardRepository.countMasteredUser(
      userId
    );

    return {
      errors: null,
      statistics: {
        amountOfCards,
        amountOfCardsLearned,
      },
    };
  }

  @Query(() => UserStreakResponse)
  @UseMiddleware(isAuth)
  async getUserStreak(@Ctx() { req }: MyContext): Promise<UserStreakResponse> {
    const userId = req.session.userId;
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

  @Query(() => CardDayResponse)
  @UseMiddleware(isAuth)
  async getCardReviewDay(@Ctx() { req }: MyContext): Promise<CardDayResponse> {
    const userId = req.session.userId;

    const amount = await this.cardCheckedRepo.checkAmountGoal(userId);

    return {
      errors: null,
      statistics: {
        amount,
      },
    };
  }

  @Query(() => CardWeekResponse)
  @UseMiddleware(isAuth)
  async getCardReviewWeek(
    @Ctx() { req }: MyContext
  ): Promise<CardWeekResponse> {
    const userId = req.session.userId;

    const daysAry = [];
    let date = new Date();

    for (let i = 0; i < 7; i++) {
      daysAry.unshift(await this.cardCheckedRepo.checkAmountGoal(userId));
      date.setDate(date.getDate() - 1);
    }

    return {
      errors: null,
      statistics: {
        daysAry,
      },
    };
  }
}
