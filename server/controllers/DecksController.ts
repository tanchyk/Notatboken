import {Response, Request, NextFunction} from 'express';
import {Brackets, getRepository} from "typeorm";
import {Deck} from "../entities/Deck";
import {Card} from "../entities/Card";

class DecksController {
    static findDecks = async (req: Request, res: Response, next: NextFunction) => {
        const userId = res.locals.userId;
        const languageId = Number.parseInt(req.params.languageId);

        const deckRepository = getRepository(Deck);
        let decks: Deck[];
        if(languageId) {
            try {
                decks = await deckRepository.createQueryBuilder("deck")
                    .leftJoinAndSelect("deck.user", "user")
                    .leftJoinAndSelect("deck.language", "language")
                    .leftJoinAndSelect("deck.folder", "folder")
                    .loadRelationCountAndMap("deck.amountOfCards", "deck.cards" )
                    .where("user.id = :id", { id: userId })
                    .where("language.languageId = :languageId", {languageId})
                    .getMany();
            } catch (err) {
                return res.status(404).send({message: "You have no decks"});
            }

            return res.status(200).json(decks);
        } else {
            return res.status(404).send({message: "You have no languages"});
        }
    }

    static addDeck = async (req: Request, res: Response, next: NextFunction) => {
        const userId = res.locals.userId;
        const {deckName, languageId} = req.body;

        if(deckName.length < 3 || deckName.length > 40) {
            return res.status(400).send({message: 'Invalid Deck name'});
        }

        const deckRepository = getRepository(Deck);

        //Checking for existing name
        const decksCheck = await deckRepository.findOne({
            relations: ["language", "user"],
            where: {
                user: {id: userId},
                language: {languageId: languageId},
                deckName
            }
        });

        if(decksCheck) {
            return res.status(400).send({message: 'You have done it, right? 🙃'});
        }

        //Creating a new deck
        const deck = new Deck();

        deck.deckName = deckName;
        deck.user = userId;
        deck.language = languageId;

        await deckRepository.save(deck);

        const deckSend: Deck = await deckRepository.findOneOrFail({
            relations: ["language", "user"], where: {
                deckName,
                user: {
                    id: userId
                },
                language: {
                    languageId
                }
            }
        });


        return res.status(200).send(deckSend);
    }

    static editDeck = async (req: Request, res: Response, next: NextFunction) => {
        const userId = res.locals.userId;
        const {deckId, deckName, languageId} = req.body;

        if(deckName.length < 3 || deckName.length > 64) {
            return res.status(400).send({message: 'Invalid Deck name'});
        }

        const deckRepository = getRepository(Deck);
        let deck: Deck | undefined;

        //Finding deck
        try {
            deck = await deckRepository.createQueryBuilder("deck")
                .leftJoinAndSelect("deck.user", "user")
                .leftJoinAndSelect("deck.language", "language")
                .leftJoinAndSelect("deck.folder", "folder")
                .loadRelationCountAndMap("deck.amountOfCards", "deck.cards" )
                .where("deck.deckId = :deckId", {deckId})
                .getOne();
        } catch (err) {
            next(err);
        }

        //Checking deck
        if(!deck) {
            return res.status(400).send({message: 'Invalid Deck'});
        } else if(deck.deckName === deckName) {
            return res.status(400).send({message: 'Please, enter different name'});
        }

        const deckCheck = await deckRepository.findOne({
            relations: ["language", "user"], where: {
                deckName,
                language: {languageId},
                user: {id: userId}
            }
        });

        if(deckCheck) {
            return res.status(400).send({message: 'Ooooops, you already have this deck 🙃'});
        }

        deck.deckName = deckName

        await deckRepository.save(deck);

        return res.status(200).send(deck);
    }

    static deleteDeck = async (req: Request, res: Response, next: NextFunction) => {
        const {deckId} = req.body;

        const deckRepository = getRepository(Deck);

        try {
            await deckRepository.delete({deckId: deckId});
        } catch (err) {
            next(err);
        }
        return res.status(204).send();
    }

    static progressDeck = async (req: Request, res: Response, next: NextFunction) => {
        const deckId = Number.parseInt(req.params.deckId);

        const cardRepository = getRepository(Card);

        const forToday = await cardRepository
            .createQueryBuilder("card")
            .leftJoin("card.deck", "deck")
            .where("deck.deckId = :deckId", {deckId})
            .andWhere(new Brackets(qb => {
                qb.where("card.reviewDate is null")
                    .orWhere(`card.reviewDate < :reviewDate`, {reviewDate: new Date()})
            }))
            .getCount()

        const notStudied = await cardRepository
            .createQueryBuilder("card")
            .leftJoin("card.deck", "deck")
            .where("deck.deckId = :deckId", {deckId})
            .andWhere(new Brackets(qb => {
                qb.where("proficiency = :v1", {v1: 'fail'})
                    .orWhere("proficiency = :v2", {v2: 'repeat'})
            }))
            .getCount();

        const stillLearning = await cardRepository
            .createQueryBuilder("card")
            .leftJoin("card.deck", "deck")
            .where("card.deckDeckId = :deckId", {deckId})
            .andWhere(new Brackets(qb => {
                qb.where("proficiency = :v1", {v1: '1d'})
                    .orWhere("proficiency = :v2", {v2: '3d'})
                    .orWhere("proficiency = :v3", {v3: '7d'})
                    .orWhere("proficiency = :v4", {v4: '21d'})
                    .orWhere("proficiency = :v5", {v5: '31d'})
            }))
            .getCount();

        const mastered = await cardRepository
            .createQueryBuilder("card")
            .leftJoin("card.deck", "deck")
            .where("deck.deckId = :deckId", {deckId})
            .andWhere(new Brackets(qb => {
                qb.where("proficiency = :v1", {v1: '90d'})
                    .orWhere("proficiency = :v2", {v2: 'learned'})
            }))
            .getCount();

        return res.status(200).send({forToday, notStudied, stillLearning, mastered});
    }
}

export default DecksController;