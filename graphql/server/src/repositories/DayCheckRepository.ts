import { EntityRepository, Repository } from "typeorm";
import { DayChecked } from "../entities/DayChecked";

@EntityRepository(DayChecked)
export class DayCheckedRepository extends Repository<DayChecked> {
  checkDays(userId: number) {
    return this.createQueryBuilder("day_checked")
      .leftJoin("day_checked.user", "user")
      .where("user.id = :id", { id: userId })
      .getMany();
  }
}
