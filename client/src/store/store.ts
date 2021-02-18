import {configureStore} from '@reduxjs/toolkit';
import userReducer from './userSlice';
import csrfReducer from './csrfSlice';
import decksReducer from './deckSlice';
import cardsReducer from './cardSlice';
import folderReducer from './folderSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        csrfToken: csrfReducer,
        decks: decksReducer,
        cards: cardsReducer,
        folders: folderReducer
    }
});

export type AppDispatch = typeof store.dispatch;

export default store;