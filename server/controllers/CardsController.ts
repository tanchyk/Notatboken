import {Response, Request, NextFunction} from 'express';
import {Brackets, getRepository} from "typeorm";
import {Card} from "../entities/Card";
import {CardChecked} from "../entities/CardChecked";
import {DayChecked} from "../entities/DayChecked";

const Reverso = require('reverso-api');

class CardsController {
    static findCards = async (req: Request, res: Response, next: NextFunction) => {
        const deckId = Number.parseInt(req.params.deckId);

        const cardRepository = getRepository(Card);
        let cards: Card[];
        if(deckId) {
            try {
                cards = await cardRepository.find({relations: ["deck"], where: {deck: {deckId: deckId}}});
            } catch (err) {
                return res.status(404).send({message: "You have no cards in this deck"});
            }

            return res.status(200).json(cards);
        } else {
            return res.status(404).send({message: "This deck has no cards!"});
        }
    }

    static findCardsForReview = async (req: Request, res: Response, next: NextFunction) => {
        const deckId = Number.parseInt(req.params.deckId);

        const cardRepository = getRepository(Card);
        let cards: Card[];

        if(deckId) {
            try {
                cards = await cardRepository.createQueryBuilder("card")
                    .leftJoinAndSelect("card.deck", "deck")
                    .where("deck.deckId = :deckId", {deckId})
                    .andWhere(new Brackets(qb => {
                        qb.where("card.reviewDate is null")
                            .orWhere(`card.reviewDate < :reviewDate`, {reviewDate: new Date()})
                    }))
                    .getMany()
            } catch (err) {
                return res.status(404).send({message: "You have no cards in this deck"});
            }

            return res.status(200).json(cards);
        } else {
            return res.status(404).send({message: "This deck has no cards!"});
        }
    }

    static addCard = async (req: Request, res: Response, next: NextFunction) => {
        const userId = res.locals.userId;
        const {
            deckId,
            languageId,
            foreignWord,
            nativeWord,
            imageId,
            voiceId,
            foreignContext,
            nativeContext
        } = req.body;

        const cardRepository = getRepository(Card);
        const card = new Card();

        //Checking for existing name
        const cardCheck = await cardRepository.createQueryBuilder("card")
            .leftJoinAndSelect("card.deck", "deck")
            .leftJoinAndSelect("deck.user", "user")
            .leftJoinAndSelect("deck.language", "language")
            .where("user.id = :id", { id: userId })
            .andWhere("language.languageId = :languageId", {languageId})
            .andWhere("card.foreignWord = :foreignWord", {foreignWord})
            .getMany();

        if(cardCheck.length > 0) {
            return res.status(400).send({message: 'You already have this card in your list.'});
        }

        card.deck = deckId;
        card.foreignWord = foreignWord;
        card.nativeWord = nativeWord;
        card.imageId = imageId;
        card.voiceId = voiceId;
        card.foreignContext = foreignContext;
        card.nativeContext = nativeContext;

        try {
            await cardRepository.save(card);
        } catch (err) {
            next(err);
        }
        return res.status(200).send({message: "Card is created"});
    }

    static changeCard = async (req: Request, res: Response, next: NextFunction) => {
        const userId = res.locals.userId;
        const {
            cardId,
            languageId,
            foreignWord,
            nativeWord,
            imageId,
            voiceId,
            foreignContext,
            nativeContext
        } = req.body;

        const cardRepository = getRepository(Card);
        let card: Card;

        //Finding card
        card = await cardRepository.findOneOrFail({relations: ["deck"], where: {cardId}});

        //Checking for existing name
        if(card.foreignWord !== foreignWord) {
            const cardCheck = await cardRepository.createQueryBuilder("card")
                .leftJoinAndSelect("card.deck", "deck")
                .leftJoinAndSelect("deck.user", "user")
                .leftJoinAndSelect("deck.language", "language")
                .where("user.id = :id", { id: userId })
                .andWhere("language.languageId = :languageId", {languageId})
                .andWhere("card.foreignWord = :foreignWord", {foreignWord})
                .getMany();

            if(cardCheck.length > 0) {
                return res.status(400).send({message: 'You already have this card in your list.'});
            }
        }

        card.foreignWord = foreignWord;
        card.nativeWord = nativeWord;
        card.imageId = imageId;
        card.voiceId = voiceId;
        card.foreignContext = foreignContext;
        card.nativeContext = nativeContext;

        try {
            await cardRepository.save(card);
        } catch (err) {
            next(err);
        }
        return res.status(200).send(card);
    }

    static changeCardStatus = async (req: Request, res: Response, next: NextFunction) => {
        const userId = res.locals.userId;
        const {cardId, proficiency, userGoal, today} = req.body;
        console.log({cardId, proficiency, userGoal, today})

        const cardRepository = getRepository(Card);
        const cardCheckedRepository = getRepository(CardChecked);
        const dayCheckedRepository = getRepository(DayChecked);
        let card: Card;

        //Finding card
        card = await cardRepository.findOneOrFail({relations: ["deck"], where: {cardId}});

        let amountOfDays = 0;

        if(proficiency === 'learned') {
            amountOfDays = 1;
        } else if(proficiency.length === 2) {
            amountOfDays = Number.parseInt(proficiency.charAt(0));
        } else if(proficiency.length === 3) {
            amountOfDays = Number.parseInt(proficiency.substring(0,2));
        }

        //Saving Statistics
        if(amountOfDays !== 0) {
            const cardChecked = new CardChecked();
            cardChecked.card = cardId;
            cardChecked.user = userId;
            await cardCheckedRepository.save(cardChecked);
        }

        if(today === false) {
            const checkAmountGoal = await cardCheckedRepository.createQueryBuilder("card_checked")
                .leftJoin("card_checked.user", "user")
                .where("user.id = :id", {id: userId})
                .andWhere("to_char(card_checked.createdAt, 'YYYY-MM-DD') = :createdAt", {createdAt: new Date().toISOString().split('T')[0]})
                .getCount()

            if(checkAmountGoal === userGoal) {
                const dayChecked = new DayChecked();
                dayChecked.user = userId;
                await dayCheckedRepository.save(dayChecked);
            }
        }

        //Saving new card state
        let date = new Date();
        date.setDate(date.getDate() + amountOfDays);

        if(proficiency === 'learned') {
            card.reviewDate = new Date(8640000000000000);
        } else {
            card.reviewDate = date;
        }
        card.proficiency = proficiency;

        try {
            await cardRepository.save(card);
        } catch (err) {
            next(err);
        }

        return res.status(200).send(card);
    }

    static deleteCard = async (req: Request, res: Response, next: NextFunction) => {
        const {cardId} = req.body;

        const cardRepository = getRepository(Card);

        try {
            await cardRepository.delete({cardId: cardId});
        } catch (err) {
            next(err);
        }
        return res.status(204).send();
    }

    static searchContext = async (req: Request, res: Response, next: NextFunction) => {
        const {languageName, foreignWord} = req.body;

        const reverso = new Reverso();

        const response = await reverso.getTranslation(foreignWord, languageName, 'English');

        if (response.context.examples === 'no context examples') {
            return res.status(404).send({message: "Sorry, we can't seem to find context for you 😔"});
        }

        return res.status(200).send(response.context.examples);
    }
}

export default CardsController;