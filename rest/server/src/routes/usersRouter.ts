import express from 'express';
import AuthController from "../controllers/AuthController";
import {authenticationJwt, getUserId} from "../middleware/middleware";
import UserController from "../controllers/UserController";
import {testEmail, testName, testPassword, testUsername} from "../middleware/validationMiddleware";

const usersRouter = express.Router();

//Auth routes
usersRouter.put(
    '/register',
    testEmail,
    testUsername,
    testPassword,
    AuthController.register
);
usersRouter.post('/login', AuthController.login);
usersRouter.post('/logout', authenticationJwt, AuthController.logout);
usersRouter.get('/confirmation/:token', AuthController.verifyRegistration);

usersRouter.post('/forgot-password', AuthController.forgotPassword);
usersRouter.post('/change-forgot-password',testPassword, AuthController.setForgot);

//User operations
usersRouter.get('/single-user', authenticationJwt, getUserId, UserController.singleUser);
usersRouter.put(
    '/update-user',
    authenticationJwt,
    getUserId,
    testName,
    testEmail,
    testUsername,
    UserController.editUser);
usersRouter.put('/update-goal', authenticationJwt, getUserId, UserController.editGoal);
usersRouter.post('/change-password', authenticationJwt, getUserId, UserController.changeUserPassword);
usersRouter.delete('/delete-user', authenticationJwt, getUserId, UserController.deleteUser);

export default  usersRouter;