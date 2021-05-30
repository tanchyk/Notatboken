import { Service } from "typedi";
import { getCustomRepository } from "typeorm";
import { Deck } from "../entities/Deck";
import { DeckRepository } from "../repositories/DeckRepository";

@Service()
export class DeckService {
  private deckRepository = getCustomRepository(DeckRepository);

  async getDecks(userId: number, languageId: number) {
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

  async createDeck(userId: number, languageId: number, deckName: string) {
    //Checking for existing name
    const decksCheck = await this.deckRepository.findDeckByName(
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

    const deckSend = await this.deckRepository.findDeckByName(
      userId,
      languageId,
      deckName
    );

    return {
      errors: null,
      deck: deckSend || null,
    };
  }

  async editDeck(
    userId: number,
    languageId: number,
    deckName: string,
    deckId: number
  ) {
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

    const deckCheck = await this.deckRepository.findDeckByName(
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
}
