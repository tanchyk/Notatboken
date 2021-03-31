import {NextFunction, Request, Response} from "express";
import {Brackets, getRepository} from "typeorm";
import {Folder} from "../entity/Folder";
import {Deck} from "../entity/Deck";
import {Card} from "../entity/Card";

class FolderController {
    static findFolders = async (req: Request, res: Response, next: NextFunction) => {
        const userId = res.locals.userId;
        const languageId = Number.parseInt(req.params.languageId);

        const folderRepository = getRepository(Folder);
        let folders: Folder[];
        if(languageId) {
            try {
                folders = await folderRepository.createQueryBuilder("folder")
                    .leftJoinAndSelect("folder.user", "user")
                    .leftJoinAndSelect("folder.language", "language")
                    .leftJoinAndSelect("folder.decks", "deck")
                    .leftJoin("deck.cards", "cards")
                    .loadRelationCountAndMap("deck.amountOfCards", "deck.cards" )
                    .where("user.id = :id", { id: userId })
                    .where("language.languageId = :languageId", {languageId})
                    .getMany();
            } catch (err) {
                return res.status(404).send({message: "You have no folders"});
            }

            return res.status(200).json(folders);
        } else {
            return res.status(404).send({message: "You have no languages"});
        }
    }

    static addFolders = async (req: Request, res: Response, next: NextFunction) => {
        const userId = res.locals.userId;
        const {folderName, languageId} = req.body;

        if(folderName.length < 3 || folderName.length > 40) {
            return res.status(400).send({message: 'Invalid Folder name'});
        }

        const folderRepository = getRepository(Folder);

        //Checking for existing name
        const folderCheck = await folderRepository.findOne({
            relations: ["language", "user"],
            where: {
                user: {id: userId},
                language: {languageId: languageId},
                folderName
            }
        });

        if(folderCheck) {
            return res.status(400).send({message: 'You have this folder already 🙃'});
        }

        const folder = new Folder();

        folder.folderName = folderName;
        folder.user = userId;
        folder.language = languageId;

        await folderRepository.save(folder);

        const folderSend: Folder = await folderRepository.createQueryBuilder("folder")
            .leftJoinAndSelect("folder.user", "user")
            .leftJoinAndSelect("folder.language", "language")
            .leftJoinAndSelect("folder.decks", "deck")
            .leftJoin("deck.cards", "cards")
            .loadRelationCountAndMap("deck.amountOfCards", "deck.cards" )
            .where("user.id = :id", { id: userId })
            .where("language.languageId = :languageId", {languageId})
            .where("folder.folderName = :folderName", {folderName})
            .getOneOrFail();


        return res.status(200).send(folderSend);
    }

    static editFolder = async (req: Request, res: Response, next: NextFunction) => {
        const userId = res.locals.userId;
        const {folderId, folderName, languageId} = req.body;

        if(folderName.length < 3 || folderName.length > 40) {
            return res.status(400).send({message: 'Invalid Folder name'});
        }

        const folderRepository = getRepository(Folder);
        let folder: Folder;
        try {
            folder = await folderRepository.createQueryBuilder("folder")
                .leftJoinAndSelect("folder.user", "user")
                .leftJoinAndSelect("folder.language", "language")
                .leftJoinAndSelect("folder.decks", "deck")
                .leftJoin("deck.cards", "cards")
                .loadRelationCountAndMap("deck.amountOfCards", "deck.cards" )
                .where("folder.folderId = :folderId", {folderId})
                .getOneOrFail();
        } catch (e) {
            return res.status(400).send({message: 'This deck do not exist'});
        }

        if(folder.folderName === folderName) {
            return res.status(400).send({message: 'Please change name of the folder'});
        }

        const checkFolder: Folder | undefined = await folderRepository.findOne({ relations: ["language", "user"],
            where: {
                folderName,
                language: {languageId},
                user: {id: userId}
            }
        });

        if(checkFolder) {
            return res.status(400).send({message: 'You already have this folder 🥱'});
        }

        folder.folderName = folderName;
        await folderRepository.save(folder);

        return res.status(200).send(folder);
    }

    static addDeckToFolder = async (req: Request, res: Response, next: NextFunction) => {
        const {folderId, deckId} = req.body;

        const deckRepository = getRepository(Deck);
        const folderRepository = getRepository(Folder);

        const deck: Deck = await deckRepository.findOneOrFail({where: {deckId}});

        if(!deck) {
            return res.status(400).send({message: "Sorry, such deck don't exist"});
        } else {
            deck.folder = folderId;
            await deckRepository.save(deck);

            const folderSend: Folder = await folderRepository.createQueryBuilder("folder")
                .leftJoinAndSelect("folder.user", "user")
                .leftJoinAndSelect("folder.language", "language")
                .leftJoinAndSelect("folder.decks", "deck")
                .leftJoin("deck.cards", "cards")
                .loadRelationCountAndMap("deck.amountOfCards", "deck.cards" )
                .where("folder.folderId = :folderId", {folderId})
                .getOneOrFail();

            return res.status(200).send({folder: folderSend});
        }
    }

    static deleteDeckFromFolder = async (req: Request, res: Response, next: NextFunction) => {
        const {folderId, deckId} = req.body;

        const deckRepository = getRepository(Deck);
        const folderRepository = getRepository(Folder);

        const deck: Deck = await deckRepository.findOneOrFail({where: {deckId}});

        if(!deck) {
            return res.status(400).send({message: "Sorry, such deck don't exist"});
        } else {
            deck.folder = null;
            await deckRepository.save(deck);

            const folderSend: Folder = await folderRepository.createQueryBuilder("folder")
                .leftJoinAndSelect("folder.user", "user")
                .leftJoinAndSelect("folder.language", "language")
                .leftJoinAndSelect("folder.decks", "deck")
                .leftJoin("deck.cards", "cards")
                .loadRelationCountAndMap("deck.amountOfCards", "deck.cards" )
                .where("folder.folderId = :folderId", {folderId})
                .getOneOrFail();

            return res.status(200).send({folder: folderSend});
        }
    }

    static deleteFolder = async (req: Request, res: Response, next: NextFunction) => {
        const {folderId} = req.body;

        const folderRepository = getRepository(Folder);

        try {
            await folderRepository.delete({folderId: folderId});
        } catch (err) {
            next(err);
        }
        return res.status(204).send();
    }

    static progressFolder = async (req: Request, res: Response) => {
        const folderId = Number.parseInt(req.params.folderId);

        const deckRepository = getRepository(Deck);
        const cardRepository = getRepository(Card);

        const amountOfDecks = await deckRepository.createQueryBuilder("deck")
            .leftJoin("deck.folder", "folder")
            .where("folder.folderId = :folderId", {folderId})
            .getCount()

        const amountOfCards = await cardRepository.createQueryBuilder("card")
            .leftJoin("card.deck", "deck")
            .leftJoin("deck.folder", "folder")
            .where("folder.folderId = :folderId", {folderId})
            .getCount()

        const amountOfCardsLearned = await cardRepository.createQueryBuilder("card")
            .leftJoin("card.deck", "deck")
            .leftJoin("deck.folder", "folder")
            .where("folder.folderId = :folderId", {folderId})
            .andWhere(new Brackets(qb => {
                qb.where("proficiency = :v1", {v1: '90d'})
                    .orWhere("proficiency = :v2", {v2: 'learned'})
            }))
            .getCount();

        return res.status(200).send({amountOfDecks, amountOfCards, amountOfCardsLearned});
    }
}

export default FolderController;