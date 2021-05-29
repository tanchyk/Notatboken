import {
  Arg,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Brackets, getCustomRepository, getRepository } from "typeorm";
import { Card, ProficiencyType } from "../entities/Card";
import { CardChecked } from "../entities/CardChecked";
import { DayChecked } from "../entities/DayChecked";
import { isAuth } from "../middleware/isAuth";
import { CardRepository } from "../repositories/CardRepository";
import {
  CardsResponse,
  ConfirmationResponse,
  MyContext,
  SingleCardResponse,
} from "../utils/types/types";

@Resolver(Card)
export class CardResolver {
  private cardRepository = getCustomRepository(CardRepository);

  @Query(() => CardsResponse)
  @UseMiddleware(isAuth)
  async findCards(
    @Arg("deckId", () => Int) deckId: number
  ): Promise<CardsResponse> {
    const cards = await this.cardRepository.findCardsForDeck(deckId);

    if (!cards) {
      return {
        errors: [
          {
            message: "This deck has no cards!",
            field: "deckId",
          },
        ],
        cards: null,
      };
    }

    return {
      errors: null,
      cards,
    };
  }

  @Query(() => CardsResponse)
  @UseMiddleware(isAuth)
  async findCardsForReview(
    @Arg("deckId", () => Int) deckId: number
  ): Promise<CardsResponse> {
    const cards = await this.cardRepository.findCardsForReview(deckId);

    if (!cards) {
      return {
        errors: [
          {
            message: "This deck has no cards!",
            field: "deckId",
          },
        ],
        cards: null,
      };
    }

    return {
      errors: null,
      cards,
    };
  }

  @Mutation(() => ConfirmationResponse)
  @UseMiddleware(isAuth)
  async addCard(
    @Arg("deckId", () => Int) deckId: number,
    @Arg("languageId", () => Int) languageId: number,
    @Arg("foreignWord") foreignWord: string,
    @Arg("nativeWord") nativeWord: string,
    @Arg("imageId", () => Int) imageId: number,
    @Arg("voiceId", () => Int) voiceId: number,
    @Arg("foreignContext") foreignContext: string,
    @Arg("nativeContext") nativeContext: string,
    @Ctx() { req }: MyContext
  ): Promise<ConfirmationResponse> {
    const userId = req.session.userId;

    const card = new Card();

    //Checking for existing name
    const cardCheck = await this.cardRepository.checkCard(
      userId,
      languageId,
      foreignWord
    );

    if (cardCheck.length > 0) {
      return {
        errors: [
          {
            message: "You already have this card in your list.",
            field: "foreignWord",
          },
        ],
        confirmed: false,
      };
    }

    Object.assign(card, {
      deck: deckId,
      foreignWord,
      nativeWord,
      imageId,
      voiceId,
      foreignContext,
      nativeContext,
    });

    try {
      await this.cardRepository.save(card);
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

  @Mutation(() => SingleCardResponse)
  @UseMiddleware(isAuth)
  async editCard(
    @Arg("cardId", () => Int) cardId: number,
    @Arg("languageId", () => Int) languageId: number,
    @Arg("foreignWord") foreignWord: string,
    @Arg("nativeWord") nativeWord: string,
    @Arg("imageId", () => Int) imageId: number,
    @Arg("voiceId", () => Int) voiceId: number,
    @Arg("foreignContext") foreignContext: string,
    @Arg("nativeContext") nativeContext: string,
    @Ctx() { req }: MyContext
  ): Promise<SingleCardResponse> {
    const userId = req.session.userId;

    const card = await this.cardRepository.findOneOrFail({
      relations: ["deck"],
      where: { cardId },
    });

    //Checking for existing name
    if (card.foreignWord !== foreignWord) {
      const cardCheck = await this.cardRepository.checkCard(
        userId,
        languageId,
        foreignWord
      );

      if (cardCheck.length > 0) {
        return {
          errors: [
            {
              message: "You already have this card in your list.",
              field: "foreignWord",
            },
          ],
          card: null,
        };
      }
    }

    card.foreignWord = foreignWord;
    card.nativeWord = nativeWord;
    card.imageId = imageId;
    card.voiceId = voiceId;
    card.foreignContext = foreignContext;
    card.nativeContext = nativeContext;

    try {
      await this.cardRepository.save(card);
    } catch (err) {
      return {
        errors: [
          {
            message: err,
            field: "cardId",
          },
        ],
        card: null,
      };
    }

    return {
      errors: null,
      card,
    };
  }

  @Mutation(() => ConfirmationResponse)
  @UseMiddleware(isAuth)
  async changeCardStatus(
    @Arg("cardId", () => Int) cardId: number,
    @Arg("proficiency") proficiency: ProficiencyType,
    @Arg("userGoal", () => Int) userGoal: number,
    @Arg("today") today: boolean,
    @Ctx() { req }: MyContext
  ): Promise<ConfirmationResponse> {
    const userId = req.session.userId;

    const cardCheckedRepository = getRepository(CardChecked);
    const dayCheckedRepository = getRepository(DayChecked);

    const card = await this.cardRepository.findCardById(cardId);

    let amountOfDays = 0;

    if (proficiency === "learned") {
      amountOfDays = 1;
    } else if (proficiency.length === 2) {
      amountOfDays = Number.parseInt(proficiency.charAt(0));
    } else if (proficiency.length === 3) {
      amountOfDays = Number.parseInt(proficiency.substring(0, 2));
    }

    //Saving Statistics
    if (amountOfDays !== 0) {
      const cardChecked = new CardChecked();
      Object.assign(cardChecked, {
        card: cardId,
        user: userId,
      });
      await cardCheckedRepository.save(cardChecked);
    }

    let notification = null;

    if (today === false) {
      const checkAmountGoal = await cardCheckedRepository
        .createQueryBuilder("card_checked")
        .leftJoin("card_checked.user", "user")
        .where("user.id = :id", { id: userId })
        .andWhere(
          "to_char(card_checked.createdAt, 'YYYY-MM-DD') = :createdAt",
          { createdAt: new Date().toISOString().split("T")[0] }
        )
        .getCount();

      if (checkAmountGoal === userGoal) {
        const dayChecked = new DayChecked();
        Object.assign(dayChecked, {
          user: userId,
        });
        await dayCheckedRepository.save(dayChecked);
        notification = "Goal Set";
      }
    }

    //Saving new card state
    let date = new Date();
    date.setDate(date.getDate() + amountOfDays);

    if (proficiency === "learned") {
      card.reviewDate = new Date(8640000000000000);
    } else {
      card.reviewDate = date;
    }
    card.proficiency = proficiency;

    try {
      await this.cardRepository.save(card);
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
