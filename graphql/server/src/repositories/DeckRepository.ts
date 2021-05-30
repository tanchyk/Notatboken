import { EntityRepository, Repository } from "typeorm";
import { Deck } from "../entities/Deck";

@EntityRepository(Deck)
export class DeckRepository extends Repository<Deck> {
  private findByUserAndLanguage() {
    return this.createQueryBuilder("deck")
      .leftJoinAndSelect("deck.user", "user")
      .leftJoinAndSelect("deck.language", "language")
      .leftJoinAndSelect("deck.folder", "folder")
      .loadRelationCountAndMap("deck.amountOfCards", "deck.cards");
  }

  findDecksForLanguage(userId: number, languageId: number) {
    return this.findByUserAndLanguage()
      .where("user.id = :id", { id: userId })
      .andWhere("language.languageId = :languageId", { languageId })
      .getMany();
  }

  findDeckById(deckId: number) {
    return this.findByUserAndLanguage()
      .where("deck.deckId = :deckId", { deckId })
      .getOne();
  }

  findDeckByName(userId: number, languageId: number, deckName: string) {
    return this.findByUserAndLanguage()
      .where("user.id = :id", { id: userId })
      .andWhere("language.languageId = :languageId", { languageId })
      .andWhere("deck.deckName = :deckName", { deckName })
      .getOne();
  }

  countDecksForFolder(folderId: number) {
    return this.createQueryBuilder("deck")
      .leftJoin("deck.folder", "folder")
      .where("folder.folderId = :folderId", { folderId })
      .getCount();
  }
}
