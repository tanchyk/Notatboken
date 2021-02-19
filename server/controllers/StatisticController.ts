import {NextFunction, Request, Response} from "express";
import {Brackets, getRepository} from "typeorm";
import {Card} from "../entities/Card";
import {User} from "../entities/User";

class StatisticController {
    static getLanguageStats = async (req: Request, res: Response, next: NextFunction) => {
        const userId = res.locals.userId;

        const userRepository = getRepository(User);
        const cardRepository = getRepository(Card);

        let user: User
        try {
            user = await  userRepository.findOneOrFail({ relations: ["userLanguages"], where: {id: userId}});
        } catch (err) {
            return res.status(404).send({message: "User not found"});
        }

        if(user.userLanguages.length === 0) {
            return res.status(404).send({message: "You have no languages"});
        } else {
            const amountAry = [];

            for(const lang of user.userLanguages) {
                amountAry.push({
                    languageName: lang.languageName, amount: await cardRepository.createQueryBuilder("card")
                        .leftJoin("card.deck", "deck")
                        .leftJoin("deck.language", "language")
                        .where("language.languageId = :languageId", {languageId: lang.languageId})
                        .getCount()
                })
            }

            return res.status(200).send(amountAry);
        }
    }

    static getUserProgress = async (req: Request, res: Response, next: NextFunction) => {
        const userId = res.locals.userId;

        const cardRepository = getRepository(Card);

        const amountOfCards = await cardRepository.createQueryBuilder("card")
            .leftJoin("card.deck", "deck")
            .leftJoin("deck.user", "user")
            .where("user.id = :id", {id: userId})
            .getCount();

        const amountOfCardsLearned = await cardRepository.createQueryBuilder("card")
            .leftJoin("card.deck", "deck")
            .leftJoin("deck.user", "user")
            .where("user.id = :id", {id: userId})
            .andWhere(new Brackets(qb => {
                qb.where("proficiency = :v1", {v1: '90d'})
                    .orWhere("proficiency = :v2", {v2: 'learned'})
            }))
            .getCount();

        return res.status(200).send({amountOfCards, amountOfCardsLearned});
    }
}

export default StatisticController;