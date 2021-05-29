import {
  Arg,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import {
  ConfirmationResponse,
  DecksResponse,
  MyContext,
  SingleDeckResponse,
} from "../utils/types/types";
import { getCustomRepository } from "typeorm";
import { isAuth } from "../middleware/isAuth";
import { Deck } from "../entities/Deck";
import { DeckRepository } from "../repositories/DeckRepository";
import { CardRepository } from "../repositories/CardRepository";

@Resolver(Deck)
export class DeckResolver {
  private deckRepository = getCustomRepository(DeckRepository);
  private cardRepository = getCustomRepository(CardRepository);

  @Query(() => DecksResponse)
  @UseMiddleware(isAuth)
  async findDecks(
    @Arg("languageId", () => Int) languageId: number,
    @Ctx() { req }: MyContext
  ): Promise<DecksResponse> {
    const userId = req.session.userId;

    if (languageId) {
      const decks = await this.deckRepository.findDecksForLanguage(
        userId,
        languageId
      );

      if (!decks) {
        return {
          errors: [
            {
              field: "decks",
              message: "You have no decks",
            },
          ],
          decks: null,
        };
      }

      return {
        errors: null,
        decks: decks,
      };
    }

    return {
      errors: [
        {
          field: "languageId",
          message: "You have no languages",
        },
      ],
      decks: null,
    };
  }

  @Mutation(() => SingleDeckResponse)
  @UseMiddleware(isAuth)
  async addDeck(
    @Arg("deckName") deckName: string,
    @Arg("languageId", () => Int) languageId: number,
    @Ctx() { req }: MyContext
  ): Promise<SingleDeckResponse> {
    const userId = req.session.userId;

    if (deckName.length < 3 || deckName.length > 40) {
      return {
        errors: [
          {
            field: "deck",
            message: "Invalid Deck name",
          },
        ],
        deck: null,
      };
    }

    //Checking for existing name
    const decksCheck = await this.deckRepository.checkDeck(
      userId,
      languageId,
      deckName
    );

    if (decksCheck) {
      return {
        errors: [
          {
            field: "deck",
            message: "You have done it, right? 🙃",
          },
        ],
        deck: null,
      };
    }

    //Creating a new deck
    const deck = new Deck();
    Object.assign(deck, {
      user: userId,
      language: languageId,
      deckName: deckName,
    });
    await this.deckRepository.save(deck);

    return {
      errors: null,
      deck: await this.deckRepository.findDeckByName(
        userId,
        languageId,
        deckName
      ),
    };
  }

  @Mutation(() => SingleDeckResponse)
  @UseMiddleware(isAuth)
  async editDeck(
    @Arg("deckId", () => Int) deckId: number,
    @Arg("deckName") deckName: string,
    @Arg("languageId", () => Int) languageId: number,
    @Ctx() { req }: MyContext
  ): Promise<SingleDeckResponse> {
    const userId = req.session.userId;

    if (deckName.length < 3 || deckName.length > 64) {
      return {
        errors: [
          {
            field: "deck",
            message: "Invalid Deck name",
          },
        ],
        deck: null,
      };
    }

    const deck = await this.deckRepository.findDeckById(deckId);

    //Checking deck
    if (!deck) {
      return {
        errors: [
          {
            field: "deck",
            message: "Invalid Deck",
          },
        ],
        deck: null,
      };
    } else if (deck.deckName === deckName) {
      return {
        errors: [
          {
            field: "deck",
            message: "Please, enter different name",
          },
        ],
        deck: null,
      };
    }

    const deckCheck = await this.deckRepository.checkDeck(
      userId,
      languageId,
      deckName
    );

    if (deckCheck) {
      return {
        errors: [
          {
            field: "deck",
            message: "Ooooops, you already have this deck 🙃",
          },
        ],
        deck: null,
      };
    }

    deck.deckName = deckName;

    await this.deckRepository.save(deck);

    return {
      errors: null,
      deck,
    };
  }

  @Mutation(() => ConfirmationResponse)
  @UseMiddleware(isAuth)
  async deleteDeck(
    @Arg("deckId", () => Int) deckId: number
  ): Promise<ConfirmationResponse> {
    try {
      await this.deckRepository.delete({ deckId: deckId });
    } catch (err) {
      return {
        errors: [
          {
            field: "deckId",
            message: err,
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

  @UseMiddleware(isAuth)
  async progressDeck(@Arg("deckId") deckId: number) {
    const forToday = await this.cardRepository.countForToday(deckId);
    const notStudied = await this.cardRepository.countNotStudied(deckId);
    const stillLearning = await this.cardRepository.countStillLearning(deckId);
    const mastered = await this.cardRepository.countMastered(deckId);

    return { forToday, notStudied, stillLearning, mastered };
  }
}
