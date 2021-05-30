import { Query, UseMiddleware, Ctx, Resolver } from "type-graphql";
import { getCustomRepository } from "typeorm";
import { isAuth } from "../middleware/isAuth";
import { CardCheckedRepository } from "../repositories/CardCheckedRepository";
import { CardRepository } from "../repositories/CardRepository";
import { StatisticService } from "../services/StatisticService";
import {
  UserProgressResponse,
  LanguageStatResponse,
  MyContext,
  UserStreakResponse,
  CardDayResponse,
  CardWeekResponse,
} from "../utils/types/types";

@Resolver()
export class StatisticResolver {
  constructor(
    private readonly statisticService: StatisticService,
    private cardRepository = getCustomRepository(CardRepository),
    private cardCheckedRepo = getCustomRepository(CardCheckedRepository)
  ) {}

  @Query(() => LanguageStatResponse)
  @UseMiddleware(isAuth)
  findLanguageStatistic(
    @Ctx() { req }: MyContext
  ): Promise<LanguageStatResponse> {
    return this.statisticService.findLanguageStatistic(req.session.userId);
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
  getUserStreak(@Ctx() { req }: MyContext): Promise<UserStreakResponse> {
    return this.statisticService.getStreak(req.session.userId);
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
