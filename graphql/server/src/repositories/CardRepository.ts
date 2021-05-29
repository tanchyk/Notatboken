import { Brackets, EntityRepository, Repository } from "typeorm";
import { Card } from "../entities/Card";

@EntityRepository(Card)
export class CardRepository extends Repository<Card> {
  private getCardsByDeck(deckId: number) {
    return this.createQueryBuilder()
      .leftJoin("card.deck", "deck")
      .where("deck.deckId = :deckId", { deckId });
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
    return this.createQueryBuilder()
      .leftJoinAndSelect("card.deck", "deck")
      .leftJoinAndSelect("deck.user", "user")
      .leftJoinAndSelect("deck.language", "language")
      .where("user.id = :id", { id: userId })
      .andWhere("language.languageId = :languageId", { languageId })
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
}
