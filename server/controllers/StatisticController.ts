import {NextFunction, Request, Response} from "express";
import {Brackets, getRepository} from "typeorm";
import {Card} from "../entities/Card";
import {User} from "../entities/User";
import {DayChecked} from "../entities/DayChecked";
import {CardChecked} from "../entities/CardChecked";

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
                        .leftJoin("deck.user", "user")
                        .leftJoin("deck.language", "language")
                        .where("user.id = :id", {id: userId})
                        .andWhere("language.languageId = :languageId", {languageId: lang.languageId})
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

    static getUserStreak = async (req: Request, res: Response, next: NextFunction) => {
        const userId = res.locals.userId;

        const dayCheckedRepository = getRepository(DayChecked);

        let streak = 0;
        let today = false;

        const checkDays = await dayCheckedRepository.createQueryBuilder("day_checked")
            .leftJoin("day_checked.user", "user")
            .where("user.id = :id", {id: userId})
            .getMany()

        checkDays.sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

        if(checkDays.length === 0) {
            return res.status(200).send({streak, today});
        }

        let date = new Date();

        if(checkDays[checkDays.length - 1].createdAt.toISOString().split('T')[0] === date.toISOString().split('T')[0]) {
            today = true;
            streak++;
            checkDays.pop();
        }
        date.setDate(date.getDate() - 1);

        for(let i = checkDays.length - 1; i >= 0; i--) {
            if(checkDays[i].createdAt.toISOString().split('T')[0] === date.toISOString().split('T')[0]) {
                date.setDate(date.getDate() - 1);
                streak++;
            } else {
                break;
            }
        }

        return res.status(200).send({streak, today});
    }

    static getCardReviewDay = async (req: Request, res: Response, next: NextFunction) => {
        const userId = res.locals.userId;

        const cardCheckedRepository = getRepository(CardChecked);

        const amount = await cardCheckedRepository.createQueryBuilder("card_checked")
            .leftJoin("card_checked.user", "user")
            .where("user.id = :id", {id: userId})
            .andWhere("to_char(card_checked.createdAt, 'YYYY-MM-DD') = :createdAt", {createdAt: new Date().toISOString().split('T')[0]})
            .getCount()

        console.log(amount)

        return res.status(200).send({amount})
    }

    static getCardReviewWeek = async (req: Request, res: Response, next: NextFunction) => {
        const userId = res.locals.userId;

        const cardCheckedRepository = getRepository(CardChecked);

        const daysAry = [];
        let date = new Date();

        for(let i = 0; i < 7; i++) {
            daysAry.unshift(await cardCheckedRepository.createQueryBuilder("card_checked")
                .leftJoin("card_checked.user", "user")
                .where("user.id = :id", {id: userId})
                .andWhere("to_char(card_checked.createdAt, 'YYYY-MM-DD') = :createdAt", {createdAt: date.toISOString().split('T')[0]})
                .getCount()
            )
            date.setDate(date.getDate() - 1);
        }

        return res.status(200).send(daysAry)
    }
}

export default StatisticController;