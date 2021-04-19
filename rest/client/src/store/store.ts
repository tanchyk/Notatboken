import {configureStore} from '@reduxjs/toolkit';
import userReducer from './userSlice';
import csrfReducer from './csrfSlice';
import streakReducer from './streakSlice';
import decksReducer from './deckSlice';
import cardsReducer from './cardSlice';
import folderReducer from './folderSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        csrfToken: csrfReducer,
        streak: streakReducer,
        decks: decksReducer,
        cards: cardsReducer,
        folders: folderReducer
    }
});

export type AppDispatch = typeof store.dispatch;

export default store;