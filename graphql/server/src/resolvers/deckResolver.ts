import {Arg, Ctx, Resolver, UseMiddleware} from "type-graphql";
import {ConfirmationResponse, DecksResponse, MyContext, SingleDeckResponse} from "../utils/types/types";
import {Deck} from "../../../../rest/server/src/entity/Deck";
import {getRepository} from "typeorm";
import {isAuth} from "../middleware/isAuth";

@Resolver()
export class DeckResolver {
    private deckRepository = getRepository(Deck);

    @UseMiddleware(isAuth)
    async findDecks(
        @Arg("languageId") languageId: number,
        @Ctx() {req}: MyContext
    ): Promise<DecksResponse> {
        const userId = req.session.userId;

        let decks: Deck[];
        if (languageId) {
            try {
                decks = await this.deckRepository.createQueryBuilder("deck")
                    .leftJoinAndSelect("deck.user", "user")
                    .leftJoinAndSelect("deck.language", "language")
                    .leftJoinAndSelect("deck.folder", "folder")
                    .loadRelationCountAndMap("deck.amountOfCards", "deck.cards")
                    .where("user.id = :id", {id: userId})
                    .andWhere("language.languageId = :languageId", {languageId})
                    .getMany();
            } catch (err) {
                return {
                    errors: [{
                        field: "decks",
                        message: "You have no decks"
                    }],
                    decks: null
                }
            }

            return {
                errors: null,
                decks: decks
            }
        }
        return {
            errors: [{
                field: 'languageId',
                message: "You have no languages"
            }],
            decks: null
        }
    }

    @UseMiddleware(isAuth)
    async addDeck(
        @Arg("deckName") deckName: string,
        @Arg("languageId") languageId: number,
        @Ctx() {req}: MyContext
    ): Promise<SingleDeckResponse> {
        const userId = req.session.userId;

        if (deckName.length < 3 || deckName.length > 40) {
            return {
                errors: [{
                    field: 'deck',
                    message: "Invalid Deck name"
                }],
                deck: null
            }
        }

        //Checking for existing name
        const decksCheck = await this.deckRepository.findOne({
            relations: ["language", "user"],
            where: {
                user: {id: userId},
                language: {languageId: languageId},
                deckName
            }
        });

        if (decksCheck) {
            return {
                errors: [{
                    field: 'deck',
                    message: "You have done it, right? 🙃"
                }],
                deck: null
            }
        }

        //Creating a new deck
        const deck = new Deck();
        Object.assign(deck, {user: userId, language: languageId, deckName: deckName});
        await this.deckRepository.save(deck);

        return {
            errors: null,
            deck: await this.deckRepository.createQueryBuilder("deck")
                .leftJoinAndSelect("deck.user", "user")
                .leftJoinAndSelect("deck.language", "language")
                .leftJoinAndSelect("deck.folder", "folder")
                .loadRelationCountAndMap("deck.amountOfCards", "deck.cards")
                .where("user.id = :id", {id: userId})
                .andWhere("language.languageId = :languageId", {languageId})
                .andWhere("deck.deckName = :deckName", {deckName})
                .getOneOrFail()
        }
    }

    @UseMiddleware(isAuth)
    async editDeck(
        @Arg("deckId") deckId: number,
        @Arg("deckName") deckName: string,
        @Arg("languageId") languageId: number,
        @Ctx() {req}: MyContext
    ): Promise<SingleDeckResponse> {
        const userId = req.session.userId;

        if(deckName.length < 3 || deckName.length > 64) {
            return {
                errors: [{
                    field: 'deck',
                    message: "Invalid Deck name"
                }],
                deck: null
            }
        }

        const deck: Deck | undefined = await this.deckRepository.createQueryBuilder("deck")
                .leftJoinAndSelect("deck.user", "user")
                .leftJoinAndSelect("deck.language", "language")
                .leftJoinAndSelect("deck.folder", "folder")
                .loadRelationCountAndMap("deck.amountOfCards", "deck.cards" )
                .where("deck.deckId = :deckId", {deckId})
                .getOne();

        //Checking deck
        if(!deck) {
            return {
                errors: [{
                    field: 'deck',
                    message: "Invalid Deck"
                }],
                deck: null
            }
        } else if(deck.deckName === deckName) {
            return {
                errors: [{
                    field: 'deck',
                    message: "Please, enter different name"
                }],
                deck: null
            }
        }

        const deckCheck = await this.deckRepository.findOne({
            relations: ["language", "user"], where: {
                deckName,
                language: {languageId},
                user: {id: userId}
            }
        });

        if(deckCheck) {
            return {
                errors: [{
                    field: 'deck',
                    message: "Ooooops, you already have this deck 🙃"
                }],
                deck: null
            }
        }

        deck.deckName = deckName

        await this.deckRepository.save(deck);

        return {
            errors: null,
            deck
        }
    }

    @UseMiddleware(isAuth)
    async deleteDeck(
        @Arg("deckId") deckId: number
    ): Promise<ConfirmationResponse> {
        const deckRepository = getRepository(Deck);

        try {
            await deckRepository.delete({deckId: deckId});
        } catch (err) {
            return {
                errors: [{
                    field: 'deckId',
                    message: err
                }],
                confirmed: false
            }
        }
        return {
            errors: null,
            confirmed: true
        }
    }

    @UseMiddleware(isAuth)
    async progressDeck(
        // @Arg("deckId") deckId: number
    ) {
        // const cardRepository = getRepository(Card);
        //
        // const forToday = await cardRepository
        //     .createQueryBuilder("card")
        //     .leftJoin("card.deck", "deck")
        //     .where("deck.deckId = :deckId", {deckId})
        //     .andWhere(new Brackets(qb => {
        //         qb.where("card.reviewDate is null")
        //             .orWhere(`card.reviewDate < :reviewDate`, {reviewDate: new Date()})
        //     }))
        //     .getCount()
        //
        // const notStudied = await cardRepository
        //     .createQueryBuilder("card")
        //     .leftJoin("card.deck", "deck")
        //     .where("deck.deckId = :deckId", {deckId})
        //     .andWhere(new Brackets(qb => {
        //         qb.where("proficiency = :v1", {v1: 'fail'})
        //             .orWhere("proficiency = :v2", {v2: 'repeat'})
        //     }))
        //     .getCount();
        //
        // const stillLearning = await cardRepository
        //     .createQueryBuilder("card")
        //     .leftJoin("card.deck", "deck")
        //     .where("card.deckDeckId = :deckId", {deckId})
        //     .andWhere(new Brackets(qb => {
        //         qb.where("proficiency = :v1", {v1: '1d'})
        //             .orWhere("proficiency = :v2", {v2: '3d'})
        //             .orWhere("proficiency = :v3", {v3: '7d'})
        //             .orWhere("proficiency = :v4", {v4: '21d'})
        //             .orWhere("proficiency = :v5", {v5: '31d'})
        //     }))
        //     .getCount();
        //
        // const mastered = await cardRepository
        //     .createQueryBuilder("card")
        //     .leftJoin("card.deck", "deck")
        //     .where("deck.deckId = :deckId", {deckId})
        //     .andWhere(new Brackets(qb => {
        //         qb.where("proficiency = :v1", {v1: '90d'})
        //             .orWhere("proficiency = :v2", {v2: 'learned'})
        //     }))
        //     .getCount();
        //
        // return res.status(200).send({forToday, notStudied, stillLearning, mastered});
    }
}