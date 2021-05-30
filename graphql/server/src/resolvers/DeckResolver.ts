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
import { Service } from "typedi";
import { DeckService } from "../services/DeckService";

@Service()
@Resolver(Deck)
export class DeckResolver {
  constructor(
    private readonly deckService: DeckService,
    private deckRepository = getCustomRepository(DeckRepository),
    private cardRepository = getCustomRepository(CardRepository)
  ) {}

  @Query(() => DecksResponse)
  @UseMiddleware(isAuth)
  async findDecks(
    @Arg("languageId", () => Int) languageId: number,
    @Ctx() { req }: MyContext
  ): Promise<DecksResponse> {
    if (languageId) {
      return this.deckService.getDecks(req.session.userId, languageId);
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

    return this.deckService.createDeck(
      req.session.userId,
      languageId,
      deckName
    );
  }

  @Mutation(() => SingleDeckResponse)
  @UseMiddleware(isAuth)
  async editDeck(
    @Arg("deckId", () => Int) deckId: number,
    @Arg("deckName") deckName: string,
    @Arg("languageId", () => Int) languageId: number,
    @Ctx() { req }: MyContext
  ): Promise<SingleDeckResponse> {
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

    return this.deckService.editDeck(
      req.session.userId,
      languageId,
      deckName,
      deckId
    );
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
