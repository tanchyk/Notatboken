import { Service } from "typedi";
import { getCustomRepository } from "typeorm";
import { Folder } from "../entities/Folder";
import { DeckRepository } from "../repositories/DeckRepository";
import { FolderRepository } from "../repositories/FolderRepository";

@Service()
export class FolderService {
  private folderRepository = getCustomRepository(FolderRepository);
  private deckRepository = getCustomRepository(DeckRepository);

  async getFolders(userId: number, languageId: number) {
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
  }

  async createFolder(userId: number, languageId: number, folderName: string) {
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

  async changeFolder(
    userId: number,
    languageId: number,
    folderId: number,
    folderName: string
  ) {
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

  async addDeckToFolder(deckId: number, folderId: number) {
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

  async deleteDeckFromFolder(deckId: number, folderId: number) {
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
}
