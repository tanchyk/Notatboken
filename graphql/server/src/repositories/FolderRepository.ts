import { EntityRepository, Repository } from "typeorm";
import { Folder } from "../entities/Folder";

@EntityRepository(Folder)
export class FolderRepository extends Repository<Folder> {
  private getFolderWithDecks() {
    return this.createQueryBuilder("folder")
      .leftJoinAndSelect("folder.user", "user")
      .leftJoinAndSelect("folder.language", "language")
      .leftJoinAndSelect("folder.decks", "deck")
      .leftJoin("deck.cards", "cards")
      .loadRelationCountAndMap("deck.amountOfCards", "deck.cards");
  }

  findFolderById(folderId: number) {
    return this.getFolderWithDecks()
      .where("folder.folderId = :folderId", { folderId })
      .getOne();
  }

  findFolderByName(userId: number, languageId: number, folderName: string) {
    return this.getFolderWithDecks()
      .where("user.id = :id", { id: userId })
      .where("language.languageId = :languageId", { languageId })
      .where("folder.folderName = :folderName", { folderName })
      .getOneOrFail();
  }

  findByLanguage(userId: number, languageId: number) {
    return this.getFolderWithDecks()
      .where("user.id = :id", { id: userId })
      .where("language.languageId = :languageId", { languageId })
      .getMany();
  }

  checkFolder(userId: number, languageId: number, folderName: string) {
    return this.findOne({
      relations: ["language", "user"],
      where: {
        user: { id: userId },
        language: { languageId: languageId },
        folderName,
      },
    });
  }
}
