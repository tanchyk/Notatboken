import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {LoginData, RegisterData, UserAuth, UserSliceType} from "../utils/types";

const initialState = {
    user: {
        userId: null,
        username: null,
        email: null
    },
    status: 'idle',
    error: null,
} as UserSliceType;

//Async reducers
export const fetchUser = createAsyncThunk<UserAuth, LoginData>(
    'user/fetchUser',
    async (loginData) => {
        const response = await fetch('/users/login', {
            method: 'POST',
            body: JSON.stringify(loginData),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return (await response.json()) as UserAuth;
    }
);

export const createUser = createAsyncThunk<UserAuth, RegisterData>(
    'user/createUser',
    async (registerData) => {
        const response = await fetch('/users/register', {
            method: 'PUT',
            body: JSON.stringify(registerData),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return (await response.json()) as UserAuth;
    }
);

//Extra Reducers
const fetchUserPending = (state: UserSliceType, {}) => {
    state.status = 'loading';
}

const fetchUserFulfilled = (state: UserSliceType, { payload }) => {
    if("message" in payload) {
        state.status = 'failed';
        state.error = payload;
    } else {
        state.status = 'succeeded';
        state.user = payload;
    }
}

const fetchUserRejected = (state: UserSliceType, { error }) => {
    state.status = 'failed';
    state.error = error;
}

//User Slice
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {

    },
    extraReducers: builder => {
        builder.addCase(fetchUser.pending, fetchUserPending)
        builder.addCase(fetchUser.fulfilled, fetchUserFulfilled)
        builder.addCase(fetchUser.rejected, fetchUserRejected)
        builder.addCase(createUser.pending, fetchUserPending)
        builder.addCase(createUser.fulfilled, fetchUserFulfilled)
        builder.addCase(createUser.rejected, fetchUserRejected)
    }
});

export const userData = (state: {user: UserSliceType}) => state.user.user;
export const userStatus = (state: {user: UserSliceType}) => state.user.status;
export const userError = (state: {user: UserSliceType}) => state.user.error;

export default userSlice.reducer;