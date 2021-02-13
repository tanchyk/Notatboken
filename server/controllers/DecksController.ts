import {Response, Request, NextFunction} from 'express';
import {getRepository} from "typeorm";
import {Deck} from "../entities/Deck";

class DecksController {
    static findDecks = async (req: Request, res: Response, next: NextFunction) => {
        const userId = res.locals.userId;
        const languageId = Number.parseInt(req.params.languageId);

        const deckRepository = getRepository(Deck);
        let decks: Deck[];
        if(languageId) {
            try {
                decks = await deckRepository.find({
                    relations: ["language", "user"], where: {
                        user: {id: userId},
                        language: {languageId: languageId}
                    }
                });
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

        if(deckName.length < 3 || deckName.length > 64) {
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
            deck = await deckRepository.findOne({ relations: ["language", "user"],where: {deckId}});
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
            relations: ["language", "user"],
            where: {
                user: {id: userId},
                language: {languageId: languageId},
                deckName
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
        const {deckId} = req.body

        const deckRepository = getRepository(Deck);

        try {
            await deckRepository.delete({deckId: deckId});
        } catch (err) {
            next(err);
        }
        return res.status(204).send();
    }
}

export default DecksController;