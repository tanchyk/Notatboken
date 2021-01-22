import {configureStore} from '@reduxjs/toolkit';
import userReducer from './userSlice';
import csrfReducer from './csrfSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        csrfToken: csrfReducer
    }
});

export type AppDispatch = typeof store.dispatch;

export default store;