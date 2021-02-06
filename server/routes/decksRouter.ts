import express from 'express';
import {authenticationJwt, getUserId} from "../middleware/middleware";
import DecksController from "../controllers/DecksController";

const decksRouter = express.Router();

decksRouter.get('/find-decks/:languageId', authenticationJwt, getUserId, DecksController.findDecks);

decksRouter.post('/create-deck', authenticationJwt, getUserId, DecksController.addDeck);

decksRouter.delete('/delete-deck', authenticationJwt, DecksController.deleteDeck)

export default  decksRouter;