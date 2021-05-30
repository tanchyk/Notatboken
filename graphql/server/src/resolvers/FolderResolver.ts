import {
  Query,
  UseMiddleware,
  Arg,
  Int,
  Ctx,
  Resolver,
  Mutation,
} from "type-graphql";
import { getCustomRepository } from "typeorm";
import { Folder } from "../entities/Folder";
import { isAuth } from "../middleware/isAuth";
import { CardRepository } from "../repositories/CardRepository";
import { DeckRepository } from "../repositories/DeckRepository";
import { FolderRepository } from "../repositories/FolderRepository";
import {
  ConfirmationResponse,
  FolderResponse,
  MyContext,
  SingleFolderResponse,
} from "../utils/types/types";

@Resolver(Folder)
export class FolderResolver {
  private folderRepository = getCustomRepository(FolderRepository);
  private deckRepository = getCustomRepository(DeckRepository);
  private cardRepository = getCustomRepository(CardRepository);

  @Query(() => FolderResponse)
  @UseMiddleware(isAuth)
  async findFolders(
    @Arg("languageId", () => Int) languageId: number,
    @Ctx() { req }: MyContext
  ): Promise<FolderResponse> {
    const userId = req.session.userId;

    if (languageId) {
      const folders = await this.folderRepository.findByLanguage(
        userId,
        languageId
      );

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
    const folderCheck = await this.folderRepository.findFolderByName(
      userId,
      languageId,
      folderName
    );

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

    const folderSend = await this.folderRepository.findFolderByName(
      userId,
      languageId,
      folderName
    );

    return {
      errors: null,
      folder: folderSend || null,
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

    const folder = await this.folderRepository.findFolderById(folderId);

    if (!folder) {
      return {
        errors: [
          {
            field: "folderId",
            message: "This folder do not exist",
          },
        ],
        folder: null,
      };
    }

    const checkFolder = await this.folderRepository.findFolderByName(
      userId,
      languageId,
      folderName
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
    const deck = await this.deckRepository.findDeckById(deckId);

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

    const folderSend = await this.folderRepository.findFolderById(folderId);

    if (!folderSend) {
      return {
        errors: [
          {
            field: "folderId",
            message: "This folder do not exist",
          },
        ],
        folder: null,
      };
    }

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
    const deck = await this.deckRepository.findDeckById(deckId);

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

    const folderSend = await this.folderRepository.findFolderById(folderId);

    if (!folderSend) {
      return {
        errors: [
          {
            field: "folderId",
            message: "This folder do not exist",
          },
        ],
        folder: null,
      };
    }

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
    const amountOfDecks = await this.deckRepository.countDecksForFolder(
      folderId
    );

    const amountOfCards = await this.cardRepository.countForFolder(folderId);

    const amountOfCardsLearned = await this.cardRepository.countMasteredFolder(
      folderId
    );

    return { amountOfDecks, amountOfCards, amountOfCardsLearned };
  }
}
