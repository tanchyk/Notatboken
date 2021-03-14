import request from 'supertest';
import {app, server, setLanguages} from "../app";
import {createTypeormConnection} from "../utils/createTypeormConnection";
import {Connection, getRepository} from "typeorm";
import {User} from "../entity/User";
import jwt from "jsonwebtoken";
import {Deck} from "../entity/Deck";
import {Folder} from "../entity/Folder";
import {Card} from "../entity/Card";

let connection: Connection;
let token: string;

beforeAll(async () => {
    connection = await createTypeormConnection();
    await setLanguages(connection);
})

describe("User request", () => {

    test("Create user", async (done) => {
        await request(app)
            .put('/users/register')
            .send({username: 'johnee', email: 'jhon@gmail.com', password: 'Bohdan2'})
            .expect(200);

        const userRepository = getRepository(User);
        const user = await userRepository.findOneOrFail({where: {username: 'johnee'}})

        expect(user).not.toBe(undefined);
        done();
    });

    test("Login user", async (done) => {
        const userRepository = getRepository(User);
        let user = null;
        user = await userRepository.findOneOrFail({where: {username: 'johnee'}})
        user.confirmed = true;
        await userRepository.save(user);

        token = jwt.sign(
            {userId: user.id},
            `${process.env.redis}`,
            {
                expiresIn: '120h',
                algorithm: "HS256"
            }
        )

        await request(app)
            .post('/users/login')
            .send({usernameOrEmail: 'johnee', password: 'Bohdan2'})
            .expect(200);

        done();
    });

    test("Change user", async (done) => {
        await request(app)
            .put('/users/update-user')
            .set('Cookie', `token=${token}`)
            .set('Content-Type', 'application/json')
            .send({name: 'Anton Comma', username: 'johnee2', email: 'jhon2@gmail.com'})
            .expect(200);

        const userRepository = getRepository(User);
        const user = await userRepository.findOne({where: {username: 'johnee2'}})

        expect(user).not.toBe(undefined);
        done();
    });

    test("Change password", async (done) => {
        await request(app)
            .post('/users/change-password')
            .set('Cookie', `token=${token}`)
            .set('Content-Type', 'application/json')
            .send({newPassword: 'Bohdan1', oldPassword: 'Bohdan2'})
            .expect(201);
        done();
    });

    test("Change user goal", async (done) => {
        await request(app)
            .put('/users/update-goal')
            .set('Cookie', `token=${token}`)
            .set('Content-Type', 'application/json')
            .send({userGoal: 10})
            .expect(204);
        done();
    });

    test("Add language", async (done) => {
        await request(app)
            .post('/languages/add-language')
            .set('Cookie', `token=${token}`)
            .set('Content-Type', 'application/json')
            .send({language: 'French'})
            .expect(200);
        done();
    });
});

describe("Deck requests", () => {

    test("Create Deck", async (done) => {
        await request(app)
            .post('/decks/create-deck')
            .set('Cookie', `token=${token}`)
            .set('Content-Type', 'application/json')
            .send({deckName: '1stDeck', languageId: 6})
            .expect(200);

        const deckRepository = getRepository(Deck);
        const deck = await deckRepository.findOne({where: {deckName: '1stDeck'}})

        expect(deck).not.toBe(undefined);
        done();
    });

    test("Edit Deck", async (done) => {
        await request(app)
            .put('/decks/edit-deck')
            .set('Cookie', `token=${token}`)
            .set('Content-Type', 'application/json')
            .send({deckId: 1, deckName: 'NewDeck', languageId: 6})
            .expect(200);

        const deckRepository = getRepository(Deck);
        const deck = await deckRepository.findOne({where: {deckName: 'NewDeck'}})

        expect(deck).not.toBe(undefined);
        done();
    });

    test("Find Decks", async (done) => {
        const data = await request(app)
            .get(`/decks/find-decks/${6}`)
            .set('Cookie', `token=${token}`)
            .set('Content-Type', 'application/json')
            .send()
            .expect(200);

        expect(data.body.length).toBeGreaterThan(0);
        done();
    });


});

describe("Folder requests", () => {

    test("Create Folder", async (done) => {
        await request(app)
            .post('/folders/create-folder')
            .set('Cookie', `token=${token}`)
            .set('Content-Type', 'application/json')
            .send({folderName: '1stFolder', languageId: 6})
            .expect(200);

        const folderRepository = getRepository(Folder);
        const folder = await folderRepository.findOne({where: {folderName: '1stFolder'}})

        expect(folder).not.toBe(undefined);
        done();
    });

    test("Edit Folder", async (done) => {
        await request(app)
            .put('/folders/edit-folder')
            .set('Cookie', `token=${token}`)
            .set('Content-Type', 'application/json')
            .send({folderId: 1, folderName: 'NewFolder', languageId: 6})
            .expect(200);

        const folderRepository = getRepository(Folder);
        const folder = await folderRepository.findOne({where: {folderName: 'NewFolder'}})

        expect(folder).not.toBe(undefined);
        done();
    });

    test("Find Folder", async (done) => {
        const data = await request(app)
            .get(`/folders/find-folders/${6}`)
            .set('Cookie', `token=${token}`)
            .set('Content-Type', 'application/json')
            .send()
            .expect(200);

        expect(data.body.length).toBeGreaterThan(0);
        done();
    });

    test("Add Deck To Folder", async (done) => {
        await request(app)
            .put('/folders/add-deck-folder')
            .set('Cookie', `token=${token}`)
            .set('Content-Type', 'application/json')
            .send({folderId: 1, deckId: 1})
            .expect(200);

        const folderRepository = getRepository(Folder);
        const folder = await folderRepository.findOne({relations: ["decks"], where: {folderId: 1}})

        expect(folder!.decks.length).toBeGreaterThan(0);
        done();
    });
});

describe("Card requests", () => {

    test("Create Card", async (done) => {
        await request(app)
            .post('/cards/create-card')
            .set('Cookie', `token=${token}`)
            .set('Content-Type', 'application/json')
            .send({deckId: 1, languageId: 6, foreignWord: 'Nei', nativeWord: 'No',})
            .expect(200);

        const cardRepository = getRepository(Card);
        const card = await cardRepository.findOne({relations: ["deck"],
            where: {
                deck: {
                    deckId: 1
                },
                foreignWord: 'Nei'
            }
        })

        expect(card).not.toBe(undefined);
        done();
    });

    test("Find Cards", async (done) => {
        const data = await request(app)
            .get(`/cards/find-cards/${1}`)
            .set('Cookie', `token=${token}`)
            .set('Content-Type', 'application/json')
            .send()
            .expect(200);

        expect(data.body.length).toBeGreaterThan(0);
        done();
    });

    test("Find For Review", async (done) => {
        const data = await request(app)
            .get(`/cards/find-review/${1}`)
            .set('Cookie', `token=${token}`)
            .set('Content-Type', 'application/json')
            .send()
            .expect(200);

        expect(data.body.length).toBeGreaterThan(0);
        done();
    });

    test("Change Card", async (done) => {
        await request(app)
            .put('/cards/edit-card')
            .set('Cookie', `token=${token}`)
            .set('Content-Type', 'application/json')
            .send({cardId: 1, languageId: 6, foreignWord: 'Ja', nativeWord: 'Yes',})
            .expect(200);

        const cardRepository = getRepository(Card);
        const card = await cardRepository.findOne({
            relations: ["deck"],
            where: {
                deck: {
                    deckId: 1
                },
                foreignWord: 'Nei'
            }
        })

        expect(card).toBe(undefined);
        done();
    });

    test("Change Card Status", async (done) => {
        await request(app)
            .put('/cards/change-status')
            .set('Cookie', `token=${token}`)
            .set('Content-Type', 'application/json')
            .send({cardId: 1, proficiency: 'learned', userGoal: 5, today: false})
            .expect(200);

        const cardRepository = getRepository(Card);
        const card = await cardRepository.findOne({
            where: {
                cardId: 1
            }
        })

        expect(card?.proficiency).toBe('learned');
        done();
    });
});

describe("Statistics", () => {
    test("Deck Progress", async (done) => {
        const data = await request(app)
            .get(`/decks/progress/${1}`)
            .set('Cookie', `token=${token}`)
            .set('Content-Type', 'application/json')
            .send()
            .expect(200);

        expect(data.body.forToday).toBe(0);
        expect(data.body.mastered).toBe(1);
        done();
    });

    test("Folder Progress", async (done) => {
        const data = await request(app)
            .get(`/folders/progress/${1}`)
            .set('Cookie', `token=${token}`)
            .set('Content-Type', 'application/json')
            .send()
            .expect(200);

        expect(data.body.amountOfDecks).toBe(1);
        expect(data.body.amountOfCardsLearned).toBe(1);
        done();
    });

    test("Language Stats", async (done) => {
        const data = await request(app)
            .get("/statistics/get-language-stats")
            .set('Cookie', `token=${token}`)
            .set('Content-Type', 'application/json')
            .send()
            .expect(200);

        expect(data.body[0].amount).toBe(1);
        done();
    });

    test("User Progress", async (done) => {
        const data = await request(app)
            .get("/statistics/get-user-progress")
            .set('Cookie', `token=${token}`)
            .set('Content-Type', 'application/json')
            .send()
            .expect(200);

        expect(data.body.amountOfCardsLearned).toBe(1);
        done();
    });

    test("User Streak", async (done) => {
        const data = await request(app)
            .get("/statistics/get-streak")
            .set('Cookie', `token=${token}`)
            .set('Content-Type', 'application/json')
            .send()
            .expect(200);

        expect(data.body.streak).toBe(0);
        done();
    });

    test("Cards Review in a Day", async (done) => {
        const data = await request(app)
            .get("/statistics/get-card-day-review")
            .set('Cookie', `token=${token}`)
            .set('Content-Type', 'application/json')
            .send()
            .expect(200);

        expect(data.body.amount).toBe(1);
        done();
    });

    test("Cards Review in a Day", async (done) => {
        const data = await request(app)
            .get("/statistics/get-card-week-review")
            .set('Cookie', `token=${token}`)
            .set('Content-Type', 'application/json')
            .send()
            .expect(200);

        expect(data.body[6]).toBe(1);
        done();
    });
});

describe("Delete", () => {
    test("Delete Card", async (done) => {
        await request(app)
            .delete('/cards/delete-card')
            .set('Cookie', `token=${token}`)
            .set('Content-Type', 'application/json')
            .send({cardId: 1})
            .expect(204);

        done();
    });

    test("Delete Deck Form Folder", async (done) => {
        await request(app)
            .put('/folders/delete-deck-folder')
            .set('Cookie', `token=${token}`)
            .set('Content-Type', 'application/json')
            .send({folderId: 1, deckId: 1})
            .expect(200);

        const folderRepository = getRepository(Folder);
        const folder = await folderRepository.findOne({relations: ["decks"], where: {folderId: 1}})

        expect(folder).not.toBe(undefined);
        expect(folder!.decks.length).toBe(0);
        done();
    });

    test("Delete Folder", async (done) => {
        await request(app)
            .delete('/folders/delete-folder')
            .set('Cookie', `token=${token}`)
            .set('Content-Type', 'application/json')
            .send({folderId: 1})
            .expect(204);

        const deckRepository = getRepository(Deck);
        const deck = await deckRepository.findOne({where: {deckId: 1}})

        expect(deck).not.toBe(undefined);
        done();
    });

    test("Delete Deck", async (done) => {
        await request(app)
            .delete('/decks/delete-deck')
            .set('Cookie', `token=${token}`)
            .set('Content-Type', 'application/json')
            .send({deckId: 1})
            .expect(204);

        done();
    });

    test("Delete User", async (done) => {
        await request(app)
            .delete('/users/delete-user')
            .set('Cookie', `token=${token}`)
            .set('Content-Type', 'application/json')
            .send({password: 'Bohdan1'})
            .expect(204);

        done();
    });
});

afterAll(async (done) => {
    await server.close();
    await connection.close();
    done();
});