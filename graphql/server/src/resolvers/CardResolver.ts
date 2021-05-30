import {
  Arg,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { getCustomRepository } from "typeorm";
import { Card, ProficiencyType } from "../entities/Card";
import { isAuth } from "../middleware/isAuth";
import { CardRepository } from "../repositories/CardRepository";
import { CardService } from "../services/CardService";
import {
  CardInput,
  CardsResponse,
  ConfirmationNotification,
  ConfirmationResponse,
  MyContext,
  SingleCardResponse,
} from "../utils/types/types";

@Resolver(Card)
export class CardResolver {
  constructor(
    private readonly cardService: CardService,
    private readonly cardRepository = getCustomRepository(CardRepository)
  ) {}

  @Query(() => CardsResponse)
  @UseMiddleware(isAuth)
  findCards(@Arg("deckId", () => Int) deckId: number): Promise<CardsResponse> {
    return this.cardService.getCardsForDeck(deckId);
  }

  @Query(() => CardsResponse)
  @UseMiddleware(isAuth)
  findCardsForReview(
    @Arg("deckId", () => Int) deckId: number
  ): Promise<CardsResponse> {
    return this.cardService.getCardsForToday(deckId);
  }

  @Mutation(() => ConfirmationResponse)
  @UseMiddleware(isAuth)
  addCard(
    @Arg("deckId", () => Int) deckId: number,
    @Arg("languageId", () => Int) languageId: number,
    @Arg("input") input: CardInput,
    @Ctx() { req }: MyContext
  ): Promise<ConfirmationResponse> {
    return this.cardService.createCard(
      req.session.userId,
      deckId,
      languageId,
      input
    );
  }

  @Mutation(() => SingleCardResponse)
  @UseMiddleware(isAuth)
  editCard(
    @Arg("cardId", () => Int) cardId: number,
    @Arg("languageId", () => Int) languageId: number,
    @Arg("input") input: CardInput,
    @Ctx() { req }: MyContext
  ): Promise<SingleCardResponse> {
    return this.cardService.changeCard(
      req.session.userId,
      cardId,
      languageId,
      input
    );
  }

  @Mutation(() => ConfirmationNotification)
  @UseMiddleware(isAuth)
  changeCardStatus(
    @Arg("cardId", () => Int) cardId: number,
    @Arg("proficiency") proficiency: ProficiencyType,
    @Arg("userGoal", () => Int) userGoal: number,
    @Arg("today") today: boolean,
    @Ctx() { req }: MyContext
  ): Promise<ConfirmationNotification> {
    return this.cardService.changeStatus(
      req.session.userId,
      cardId,
      proficiency,
      userGoal,
      today
    );
  }

  @Mutation(() => ConfirmationResponse)
  @UseMiddleware(isAuth)
  async deleteDeck(
    @Arg("cardId", () => Int) cardId: number
  ): Promise<ConfirmationResponse> {
    try {
      await this.cardRepository.delete({ cardId: cardId });
    } catch (err) {
      return {
        errors: [
          {
            message: err,
            field: "cardId",
          },
        ],
        confirmed: false,
      };
    }

    return {
      errors: null,
      confirmed: true,
    };
  }
}
