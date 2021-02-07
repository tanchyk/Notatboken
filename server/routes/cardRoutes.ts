import express from 'express';
import {authenticationJwt, getUserId} from "../middleware/middleware";
import CardsController from "../controllers/CardsController";

const cardsRouter = express.Router();

cardsRouter.get('/find-cards/:deckId', authenticationJwt, CardsController.findCards);

cardsRouter.post('/create-card', authenticationJwt, getUserId, CardsController.addCard);

cardsRouter.delete('/delete-card', authenticationJwt, CardsController.deleteCard)

export default  cardsRouter;