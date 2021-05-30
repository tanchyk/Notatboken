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
import { FolderService } from "../services/FolderService";
import {
  ConfirmationResponse,
  FolderResponse,
  MyContext,
  SingleFolderResponse,
} from "../utils/types/types";

@Resolver(Folder)
export class FolderResolver {
  constructor(
    private readonly folderService: FolderService,
    private folderRepository = getCustomRepository(FolderRepository),
    private deckRepository = getCustomRepository(DeckRepository),
    private cardRepository = getCustomRepository(CardRepository)
  ) {}

  @Query(() => FolderResponse)
  @UseMiddleware(isAuth)
  async findFolders(
    @Arg("languageId", () => Int) languageId: number,
    @Ctx() { req }: MyContext
  ): Promise<FolderResponse> {
    if (languageId) {
      return this.folderService.getFolders(req.session.userId, languageId);
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
  async addFolder(
    @Arg("folderName") folderName: string,
    @Arg("languageId") languageId: number,
    @Ctx() { req }: MyContext
  ): Promise<SingleFolderResponse> {
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

    return this.folderService.createFolder(
      req.session.userId,
      languageId,
      folderName
    );
  }

  @Mutation(() => SingleFolderResponse)
  @UseMiddleware(isAuth)
  async editFolder(
    @Arg("folderId") folderId: number,
    @Arg("folderName") folderName: string,
    @Arg("languageId") languageId: number,
    @Ctx() { req }: MyContext
  ): Promise<SingleFolderResponse> {
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

    return this.folderService.changeFolder(
      req.session.userId,
      languageId,
      folderId,
      folderName
    );
  }

  @Mutation(() => SingleFolderResponse)
  @UseMiddleware(isAuth)
  addDeckToFolder(
    @Arg("folderId", () => Int) folderId: number,
    @Arg("deckId", () => Int) deckId: number
  ): Promise<SingleFolderResponse> {
    return this.folderService.addDeckToFolder(deckId, folderId);
  }

  @Mutation(() => SingleFolderResponse)
  @UseMiddleware(isAuth)
  deleteDeckFromFolder(
    @Arg("folderId", () => Int) folderId: number,
    @Arg("deckId", () => Int) deckId: number
  ): Promise<SingleFolderResponse> {
    return this.folderService.deleteDeckFromFolder(deckId, folderId);
  }

  @Mutation(() => ConfirmationResponse)
  @UseMiddleware(isAuth)
  async deleteFolder(
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
