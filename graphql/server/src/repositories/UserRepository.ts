import { EntityRepository, Repository } from "typeorm";
import { User } from "../entities/User";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  findUserById(userId: number) {
    return this.findOne({
      where: { id: userId },
    });
  }

  findByIdWithLanguages(userId: number) {
    return this.findOne({
      relations: ["userLanguages"],
      where: { id: userId },
    });
  }

  findUserByEmail(email: string) {
    return this.findOne({ relations: ["userLanguages"], where: email });
  }

  findUserByUsername(username: string) {
    return this.findOne({ relations: ["userLanguages"], where: username });
  }

  findUserByEmailOrUsername(email: string, username: string) {
    return this.findOne({
      where: [
        {
          username,
        },
        {
          email,
        },
      ],
    });
  }
}
