import {Response, Request, NextFunction} from 'express';
import {getRepository} from "typeorm";
import {Card} from "../entities/Card";

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
            cardImage,
            voiceId,
            foreignContext,
            nativeContext
        } = req.body;

        const cardRepository = getRepository(Card);
        const card = new Card();

        //Checking for existing name
        const cardCheck = await cardRepository.findOne({
            relations: ["deck", "user", "language"],
            where: {
                user: {id: userId},
                language: {languageId: languageId},
                foreignWord: foreignWord
            }
        });

        if(cardCheck) {
            return res.status(400).send({message: 'You already have this card in your list.'});
        }

        card.deck = deckId;
        card.foreignWord = foreignWord;
        card.nativeWord = nativeWord;
        card.cardImage = cardImage;
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
        const {cardId} = req.body

        const cardRepository = getRepository(Card);

        try {
            await cardRepository.delete({cardId: cardId});
        } catch (err) {
            next(err);
        }
        return res.status(204).send();
    }
}

export default CardsController;