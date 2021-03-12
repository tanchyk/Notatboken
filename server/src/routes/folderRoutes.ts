import express from 'express';
import {authenticationJwt, getUserId} from "../middleware/middleware";
import FolderController from "../controllers/FolderController";

const foldersRouter = express.Router();

foldersRouter.get('/find-folders/:languageId', authenticationJwt, getUserId, FolderController.findFolders);
foldersRouter.post('/create-folder', authenticationJwt, getUserId, FolderController.addFolders);
foldersRouter.put('/edit-folder', authenticationJwt, getUserId, FolderController.editFolder);

foldersRouter.put('/add-deck-folder', authenticationJwt, FolderController.addDeckToFolder);
foldersRouter.put('/delete-deck-folder', authenticationJwt, FolderController.deleteDeckFromFolder);

foldersRouter.delete('/delete-folder', authenticationJwt, FolderController.deleteFolder);

foldersRouter.get('/progress/:folderId', authenticationJwt, FolderController.progressFolder);

export default foldersRouter;