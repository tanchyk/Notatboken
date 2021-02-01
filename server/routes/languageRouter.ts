import express from 'express';
import LanguageController from '../controllers/LanguageController';
import {authenticationJwt, getUserId} from "../middleware/middleware";

const languageRouter = express.Router();

languageRouter.get('/language',authenticationJwt, getUserId, LanguageController.getLanguages);

languageRouter.post('/add-language', authenticationJwt, getUserId, LanguageController.addLanguage);

export default  languageRouter;