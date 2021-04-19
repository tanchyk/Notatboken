import express from 'express';
import {authenticationJwt, getUserId} from "../middleware/middleware";
import DecksController from "../controllers/DecksController";

const decksRouter = express.Router();

decksRouter.get('/find-decks/:languageId', authenticationJwt, getUserId, DecksController.findDecks);

decksRouter.post('/create-deck', authenticationJwt, getUserId, DecksController.addDeck);

decksRouter.delete('/delete-deck', authenticationJwt, DecksController.deleteDeck);

decksRouter.put('/edit-deck', authenticationJwt, getUserId, DecksController.editDeck);

decksRouter.get('/progress/:deckId', authenticationJwt, DecksController.progressDeck);

export default  decksRouter;