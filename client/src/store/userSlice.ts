import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {LoginData, UserAuth, UserSliceType} from "../utils/types";

const initialState = {
    user: {
        userId: null,
        token: null
    },
    status: 'idle',
    error: null,
} as UserSliceType;

export const fetchUser = createAsyncThunk<UserAuth, LoginData>(
    'user/fetchUser',
    async (loginData) => {
        const response = await fetch('http://localhost:5000/users/login', {
            method: 'POST',
            body: JSON.stringify(loginData),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return (await response.json()) as UserAuth;
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {

    },
    extraReducers: builder => {
        builder.addCase(fetchUser.pending, (state, {}) => {
            state.status = 'loading';
        })
        builder.addCase(fetchUser.fulfilled, (state, { payload }) => {
            state.status = 'succeeded';
            state.user = payload;
        })
        builder.addCase(fetchUser.rejected, (state, { error}) => {
            state.status = 'failed';
            state.error = error;
        })
    }
});

export const userData = (state: {user: UserAuth}) => state.user;
export const userStatus = (state: {status: string}) => state.status;
export const userError = (state: {error: string}) => state.error;

export default userSlice.reducer;