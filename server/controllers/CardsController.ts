import {Response, Request, NextFunction} from 'express';
import {getRepository} from "typeorm";
import {Card} from "../entities/Card";

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

        if(!foreignWord || !nativeWord) {
            return res.status(404).send({message: 'Please, check your data.'});
        }

        const cardRepository = getRepository(Card);
        const card = new Card();

        //Checking for existing name
        const cardCheck = await cardRepository.createQueryBuilder("card")
            .leftJoinAndSelect("card.deck", "deck")
            .leftJoinAndSelect("deck.user", "user")
            .leftJoinAndSelect("deck.language", "language")
            .where("user.id = :id", { id: userId })
            .where("language.languageId = :languageId", {languageId})
            .where("card.foreignWord = :foreignWord", {foreignWord})
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
        console.log({languageName, foreignWord})

        const reverso = new Reverso();

        try {
            const response = await reverso.getTranslation(foreignWord, languageName, 'English');
            return res.status(200).send(response.context.examples);
        } catch (err) {
            return res.status(404).send({message: err});
        }
    }
}

export default CardsController;