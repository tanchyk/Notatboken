import express from 'express';
import {authenticationJwt, getUserId} from "../middleware/middleware";
import StatisticController from "../controllers/StatisticController";

const statisticsRouter = express.Router();

statisticsRouter.get('/get-language-stats', authenticationJwt, getUserId, StatisticController.getLanguageStats);

statisticsRouter.get('/get-user-progress', authenticationJwt, getUserId, StatisticController.getUserProgress);

statisticsRouter.get('/get-streak', authenticationJwt, getUserId, StatisticController.getUserStreak);

export default  statisticsRouter;