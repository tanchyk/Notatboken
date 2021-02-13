import express from 'express';
import {authenticationJwt, getUserId} from "../middleware/middleware";
import CardsController from "../controllers/CardsController";
import {testCard} from "../middleware/validationMiddleware";

const cardsRouter = express.Router();

cardsRouter.get('/find-cards/:deckId', authenticationJwt, CardsController.findCards);

cardsRouter.post('/create-card', authenticationJwt, getUserId, testCard, CardsController.addCard);

cardsRouter.delete('/delete-card', authenticationJwt, CardsController.deleteCard);

cardsRouter.post('/search-context', authenticationJwt, CardsController.searchContext);

cardsRouter.put('/edit-card', authenticationJwt, getUserId, testCard, CardsController.changeCard);

export default  cardsRouter;