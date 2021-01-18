import express from 'express';
import AuthController from "../controllers/AuthController";

const usersRouter = express.Router();

usersRouter.put('/register', AuthController.register);

usersRouter.post('/login', AuthController.login);

export default  usersRouter;