import { EntityRepository, Repository } from "typeorm";
import { CardChecked } from "../entities/CardChecked";

@EntityRepository(CardChecked)
export class CardCheckedRepository extends Repository<CardChecked> {
  checkAmountGoal(userId: number) {
    return this.createQueryBuilder("card_checked")
      .leftJoin("card_checked.user", "user")
      .where("user.id = :id", { id: userId })
      .andWhere("to_char(card_checked.createdAt, 'YYYY-MM-DD') = :createdAt", {
        createdAt: new Date().toISOString().split("T")[0],
      })
      .getCount();
  }
}
