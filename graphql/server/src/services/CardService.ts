import { Service } from "typedi";
import { getCustomRepository, getRepository } from "typeorm";
import { Card, ProficiencyType } from "../entities/Card";
import { CardChecked } from "../entities/CardChecked";
import { DayChecked } from "../entities/DayChecked";
import { CardCheckedRepository } from "../repositories/CardCheckedRepository";
import { CardRepository } from "../repositories/CardRepository";
import { CardInput } from "../utils/types/types";

@Service()
export class CardService {
  private readonly cardRepository = getCustomRepository(CardRepository);
  private readonly cardCheckedRepository = getCustomRepository(
    CardCheckedRepository
  );
  private readonly dayCheckedRepository = getRepository(DayChecked);

  async getCardsForDeck(deckId: number) {
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

  async getCardsForToday(deckId: number) {
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

  async createCard(
    userId: number,
    deckId: number,
    languageId: number,
    input: CardInput
  ) {
    //Checking for existing name
    const cardCheck = await this.cardRepository.checkCard(
      userId,
      languageId,
      input.foreignWord
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

    const card = new Card();
    Object.assign(card, {
      deck: deckId,
      ...input,
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

  async changeCard(
    userId: number,
    cardId: number,
    languageId: number,
    input: CardInput
  ) {
    const card = await this.cardRepository.findCardById(cardId);

    //Checking for existing name
    if (card.foreignWord !== input.foreignWord) {
      const cardCheck = await this.cardRepository.checkCard(
        userId,
        languageId,
        input.foreignWord
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

    Object.assign(card, {
      ...input,
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
        card: null,
      };
    }

    return {
      errors: null,
      card,
    };
  }

  async changeStatus(
    userId: number,
    cardId: number,
    proficiency: ProficiencyType,
    userGoal: number,
    today: boolean
  ) {
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
      await this.cardCheckedRepository.save(cardChecked);
    }

    let notification = null;

    if (today === false) {
      const checkAmountGoal = await this.cardCheckedRepository.checkAmountGoal(
        userId
      );

      if (checkAmountGoal === userGoal) {
        const dayChecked = new DayChecked();
        Object.assign(dayChecked, {
          user: userId,
        });
        await this.dayCheckedRepository.save(dayChecked);
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
        notification,
      };
    }

    return {
      errors: null,
      confirmed: true,
      notification,
    };
  }
}
