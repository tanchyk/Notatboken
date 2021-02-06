import {configureStore} from '@reduxjs/toolkit';
import userReducer from './userSlice';
import csrfReducer from './csrfSlice';
import decksReducer from './deckSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        csrfToken: csrfReducer,
        decks: decksReducer
    }
});

export type AppDispatch = typeof store.dispatch;

export default store;