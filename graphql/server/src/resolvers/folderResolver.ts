import {
  Query,
  UseMiddleware,
  Arg,
  Int,
  Ctx,
  Resolver,
  Mutation,
} from "type-graphql";
import { Brackets, getRepository } from "typeorm";
import { Card } from "../entities/Card";
import { Deck } from "../entities/Deck";
import { Folder } from "../entities/Folder";
import { isAuth } from "../middleware/isAuth";
import {
  ConfirmationResponse,
  FolderResponse,
  MyContext,
  SingleFolderResponse,
} from "../utils/types/types";

@Resolver(Folder)
export class FolderResolver {
  private folderRepository = getRepository(Folder);
  private deckRepository = getRepository(Deck);
  private cardRepository = getRepository(Card);

  @Query(() => FolderResponse)
  @UseMiddleware(isAuth)
  async findFolders(
    @Arg("languageId", () => Int) languageId: number,
    @Ctx() { req }: MyContext
  ): Promise<FolderResponse> {
    const userId = req.session.userId;

    if (languageId) {
      const folders = await this.folderRepository
        .createQueryBuilder("folder")
        .leftJoinAndSelect("folder.user", "user")
        .leftJoinAndSelect("folder.language", "language")
        .leftJoinAndSelect("folder.decks", "deck")
        .leftJoin("deck.cards", "cards")
        .loadRelationCountAndMap("deck.amountOfCards", "deck.cards")
        .where("user.id = :id", { id: userId })
        .where("language.languageId = :languageId", { languageId })
        .getMany();
      if (!folders) {
        return {
          errors: [
            {
              field: "folderId",
              message: "You have no folders",
            },
          ],
          folders: null,
        };
      }

      return {
        errors: null,
        folders,
      };
    } else {
      return {
        errors: [
          {
            field: "languageId",
            message: "You have no languages",
          },
        ],
        folders: null,
      };
    }
  }

  @Mutation(() => SingleFolderResponse)
  @UseMiddleware(isAuth)
  async addDeck(
    @Arg("folderName") folderName: string,
    @Arg("languageId") languageId: number,
    @Ctx() { req }: MyContext
  ): Promise<SingleFolderResponse> {
    const userId = req.session.userId;

    if (folderName.length < 3 || folderName.length > 40) {
      return {
        errors: [
          {
            field: "folderName",
            message: "Invalid Folder name",
          },
        ],
        folder: null,
      };
    }

    //Checking for existing name
    const folderCheck = await this.folderRepository.findOne({
      relations: ["language", "user"],
      where: {
        user: { id: userId },
        language: { languageId: languageId },
        folderName,
      },
    });

    if (folderCheck) {
      return {
        errors: [
          {
            field: "folderName",
            message: "You have this folder already 🙃",
          },
        ],
        folder: null,
      };
    }

    const folder = new Folder();

    Object.assign(folder, {
      folderName,
      user: userId,
      language: languageId,
    });

    await this.folderRepository.save(folder);

    const folderSend: Folder = await this.folderRepository
      .createQueryBuilder("folder")
      .leftJoinAndSelect("folder.user", "user")
      .leftJoinAndSelect("folder.language", "language")
      .leftJoinAndSelect("folder.decks", "deck")
      .leftJoin("deck.cards", "cards")
      .loadRelationCountAndMap("deck.amountOfCards", "deck.cards")
      .where("user.id = :id", { id: userId })
      .where("language.languageId = :languageId", { languageId })
      .where("folder.folderName = :folderName", { folderName })
      .getOneOrFail();

    return {
      errors: null,
      folder: folderSend,
    };
  }

  @Mutation(() => SingleFolderResponse)
  @UseMiddleware(isAuth)
  async editFolder(
    @Arg("folderId") folderId: number,
    @Arg("folderName") folderName: string,
    @Arg("languageId") languageId: number,
    @Ctx() { req }: MyContext
  ): Promise<SingleFolderResponse> {
    const userId = req.session.userId;

    if (folderName.length < 3 || folderName.length > 40) {
      return {
        errors: [
          {
            field: "folderName",
            message: "Invalid Folder name",
          },
        ],
        folder: null,
      };
    }

    const folder = await this.folderRepository
      .createQueryBuilder("folder")
      .leftJoinAndSelect("folder.user", "user")
      .leftJoinAndSelect("folder.language", "language")
      .leftJoinAndSelect("folder.decks", "deck")
      .leftJoin("deck.cards", "cards")
      .loadRelationCountAndMap("deck.amountOfCards", "deck.cards")
      .where("folder.folderId = :folderId", { folderId })
      .getOneOrFail();

    if (!folder) {
      return {
        errors: [
          {
            field: "folderId",
            message: "This deck do not exist",
          },
        ],
        folder: null,
      };
    }

    const checkFolder: Folder | undefined = await this.folderRepository.findOne(
      {
        relations: ["language", "user"],
        where: {
          folderName,
          language: { languageId },
          user: { id: userId },
        },
      }
    );

    if (checkFolder) {
      return {
        errors: [
          {
            field: "folderName",
            message: "You already have this folder 🥱",
          },
        ],
        folder: null,
      };
    }

    folder.folderName = folderName;
    await this.folderRepository.save(folder);

    return {
      errors: null,
      folder,
    };
  }

  @Mutation(() => SingleFolderResponse)
  @UseMiddleware(isAuth)
  async addDeckToFolder(
    @Arg("folderId", () => Int) folderId: number,
    @Arg("deckId", () => Int) deckId: number
  ): Promise<SingleFolderResponse> {
    const deck = await this.deckRepository.findOneOrFail({
      where: { deckId },
    });

    if (!deck) {
      return {
        errors: [
          {
            field: "deckId",
            message: "Sorry, such deck doesn't exist",
          },
        ],
        folder: null,
      };
    }

    Object.assign(deck, {
      folder: folderId,
    });
    await this.deckRepository.save(deck);

    const folderSend: Folder = await this.folderRepository
      .createQueryBuilder("folder")
      .leftJoinAndSelect("folder.user", "user")
      .leftJoinAndSelect("folder.language", "language")
      .leftJoinAndSelect("folder.decks", "deck")
      .leftJoin("deck.cards", "cards")
      .loadRelationCountAndMap("deck.amountOfCards", "deck.cards")
      .where("folder.folderId = :folderId", { folderId })
      .getOneOrFail();

    return {
      errors: null,
      folder: folderSend,
    };
  }

  @Mutation(() => SingleFolderResponse)
  @UseMiddleware(isAuth)
  async deleteDeckFromFolder(
    @Arg("folderId", () => Int) folderId: number,
    @Arg("deckId", () => Int) deckId: number
  ): Promise<SingleFolderResponse> {
    const deck = await this.deckRepository.findOneOrFail({
      where: { deckId },
    });

    if (!deck) {
      return {
        errors: [
          {
            field: "deckId",
            message: "Sorry, such deck doesn't exist",
          },
        ],
        folder: null,
      };
    }

    deck.folder = null;
    await this.deckRepository.save(deck);

    const folderSend: Folder = await this.folderRepository
      .createQueryBuilder("folder")
      .leftJoinAndSelect("folder.user", "user")
      .leftJoinAndSelect("folder.language", "language")
      .leftJoinAndSelect("folder.decks", "deck")
      .leftJoin("deck.cards", "cards")
      .loadRelationCountAndMap("deck.amountOfCards", "deck.cards")
      .where("folder.folderId = :folderId", { folderId })
      .getOneOrFail();

    return {
      errors: null,
      folder: folderSend,
    };
  }

  @Mutation(() => ConfirmationResponse)
  @UseMiddleware(isAuth)
  async deleteDeck(
    @Arg("folderId", () => Int) folderId: number
  ): Promise<ConfirmationResponse> {
    try {
      await this.folderRepository.delete({ folderId: folderId });
    } catch (err) {
      return {
        errors: [
          {
            field: "folderId",
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
  async progressFolder(@Arg("folderId", () => Int) folderId: number) {
    const amountOfDecks = await this.deckRepository
      .createQueryBuilder("deck")
      .leftJoin("deck.folder", "folder")
      .where("folder.folderId = :folderId", { folderId })
      .getCount();
    const amountOfCards = await this.cardRepository
      .createQueryBuilder("card")
      .leftJoin("card.deck", "deck")
      .leftJoin("deck.folder", "folder")
      .where("folder.folderId = :folderId", { folderId })
      .getCount();
    const amountOfCardsLearned = await this.cardRepository
      .createQueryBuilder("card")
      .leftJoin("card.deck", "deck")
      .leftJoin("deck.folder", "folder")
      .where("folder.folderId = :folderId", { folderId })
      .andWhere(
        new Brackets((qb) => {
          qb.where("proficiency = :v1", { v1: "90d" }).orWhere(
            "proficiency = :v2",
            { v2: "learned" }
          );
        })
      )
      .getCount();
    return { amountOfDecks, amountOfCards, amountOfCardsLearned };
  }
}
