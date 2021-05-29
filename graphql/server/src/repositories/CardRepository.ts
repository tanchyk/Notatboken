import { Brackets, EntityRepository, Repository } from "typeorm";
import { Card } from "../entities/Card";

@EntityRepository(Card)
export class CardRepository extends Repository<Card> {
  private getCardsByDeck(deckId: number) {
    return this.createQueryBuilder("card")
      .leftJoin("card.deck", "deck")
      .where("deck.deckId = :deckId", { deckId });
  }

  private getCardsByFolder(folderId: number) {
    return this.createQueryBuilder("card")
      .leftJoin("card.deck", "deck")
      .leftJoin("deck.folder", "folder")
      .where("folder.folderId = :folderId", { folderId });
  }

  private getCardByUser(userId: number) {
    return this.createQueryBuilder("card")
      .leftJoin("card.deck", "deck")
      .leftJoin("deck.user", "user")
      .where("user.id = :id", { id: userId });
  }

  private getCardByUserAndLanguage(userId: number, languageId: number) {
    return this.getCardByUser(userId)
      .leftJoinAndSelect("deck.language", "language")
      .andWhere("language.languageId = :languageId", { languageId });
  }

  findCardById(cardId: number) {
    return this.findOneOrFail({
      relations: ["deck"],
      where: { cardId },
    });
  }

  findCardsForDeck(deckId: number) {
    return this.getCardsByDeck(deckId).getMany();
  }

  findCardsForReview(deckId: number) {
    return this.getCardsByDeck(deckId)
      .andWhere(
        new Brackets((qb) => {
          qb.where("card.reviewDate is null").orWhere(
            `card.reviewDate < :reviewDate`,
            { reviewDate: new Date() }
          );
        })
      )
      .getMany();
  }

  checkCard(userId: number, languageId: number, foreignWord: string) {
    return this.getCardByUserAndLanguage(userId, languageId)
      .andWhere("card.foreignWord = :foreignWord", { foreignWord })
      .getMany();
  }

  countForToday(deckId: number) {
    return this.getCardsByDeck(deckId)
      .andWhere(
        new Brackets((qb) => {
          qb.where("card.reviewDate is null").orWhere(
            `card.reviewDate < :reviewDate`,
            { reviewDate: new Date() }
          );
        })
      )
      .getCount();
  }

  countNotStudied(deckId: number) {
    return this.getCardsByDeck(deckId)
      .andWhere(
        new Brackets((qb) => {
          qb.where("proficiency = :v1", { v1: "fail" }).orWhere(
            "proficiency = :v2",
            { v2: "repeat" }
          );
        })
      )
      .getCount();
  }

  countStillLearning(deckId: number) {
    return this.getCardsByDeck(deckId)
      .andWhere(
        new Brackets((qb) => {
          qb.where("proficiency = :v1", { v1: "1d" })
            .orWhere("proficiency = :v2", { v2: "3d" })
            .orWhere("proficiency = :v3", { v3: "7d" })
            .orWhere("proficiency = :v4", { v4: "21d" })
            .orWhere("proficiency = :v5", { v5: "31d" });
        })
      )
      .getCount();
  }

  countMastered(deckId: number) {
    return this.getCardsByDeck(deckId)
      .andWhere(
        new Brackets((qb) => {
          qb.where("proficiency = :v1", { v1: "90d" }).orWhere(
            "proficiency = :v2",
            { v2: "learned" }
          );
        })
      )
      .getCount();
  }

  countForFolder(folderId: number) {
    return this.getCardsByFolder(folderId).getCount();
  }

  countForLanugage(userId: number, languageId: number) {
    return this.getCardByUserAndLanguage(userId, languageId).getCount();
  }

  countForUser(userId: number) {
    return this.getCardByUser(userId).getCount();
  }

  countMasteredFolder(folderId: number) {
    return this.getCardsByFolder(folderId)
      .andWhere(
        new Brackets((qb) => {
          qb.where("proficiency = :v1", { v1: "90d" }).orWhere(
            "proficiency = :v2",
            { v2: "learned" }
          );
        })
      )
      .getCount();
  }

  countMasteredUser(userId: number) {
    return this.getCardByUser(userId)
      .andWhere(
        new Brackets((qb) => {
          qb.where("proficiency = :v1", { v1: "90d" }).orWhere(
            "proficiency = :v2",
            { v2: "learned" }
          );
        })
      )
      .getCount();
  }
}
