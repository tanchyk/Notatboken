import express from 'express';
import AuthController from "../controllers/AuthController";
import {authenticationJwt, getUserId} from "../middleware/middleware";
import UserController from "../controllers/UserController";

const usersRouter = express.Router();

usersRouter.put('/register', AuthController.register);

usersRouter.post('/login', AuthController.login);

usersRouter.post('/logout', authenticationJwt, AuthController.logout);

usersRouter.get('/single-user', authenticationJwt, getUserId, UserController.singleUser);

usersRouter.delete('/delete-user', authenticationJwt, getUserId, UserController.deleteUser);

export default  usersRouter;