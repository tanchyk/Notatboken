import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {CsrfSliceType, LoginData, RegisterData, UserAuth, UserSliceType} from "../utils/types";

const initialState = {
    user: {
        userId: null,
        username: null,
        email: null
    },
    status: 'idle',
    error: {
        type: null,
        message: null
    },
} as UserSliceType;

//Async reducers
export const fetchUser = createAsyncThunk<UserAuth, LoginData>(
    'user/fetchUser',
    async (loginData, {getState}) => {
        const {csrfToken} = getState() as {csrfToken: CsrfSliceType}
        const response = await fetch('/users/login', {
            method: 'POST',
            body: JSON.stringify(loginData),
            headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': `${csrfToken.csrfToken}`
            }
        });
        return (await response.json()) as UserAuth;
    }
);

export const createUser = createAsyncThunk<UserAuth, RegisterData>(
    'user/createUser',
    async (registerData, {getState}) => {
        const {csrfToken} = getState() as {csrfToken: CsrfSliceType}
        const response = await fetch('/users/register', {
            method: 'PUT',
            body: JSON.stringify(registerData),
            headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': `${csrfToken.csrfToken}`
            }
        });
        return (await response.json()) as UserAuth;
    }
);

export const loadUser = createAsyncThunk<UserAuth, void>(
    'user/loadUser',
    async () => {
        const response = await fetch('/users/single-user', {
            method: 'GET'
        });
        return (await response.json()) as UserAuth;
    }
);

export const logoutUser = createAsyncThunk<void, void>(
    'user/logoutUser',
    async (_,{getState}) => {
        const {csrfToken} = getState() as {csrfToken: CsrfSliceType}
        await fetch('/users/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': `${csrfToken.csrfToken}`
            }
        })
    }
)

//Extra Reducers
const fetchUserPending = (state: UserSliceType, {}) => {
    state.status = 'loading';
}

const fetchUserRejected = (state: UserSliceType, {}) => {
    state.status = 'failed';
}

//User Slice
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {

    },
    extraReducers: builder => {
        builder.addCase(fetchUser.pending, fetchUserPending)
        builder.addCase(fetchUser.fulfilled, (state: UserSliceType, { payload }) => {
            if("message" in payload) {
                state.status = 'failed';
                state.error.message = payload['message'];
                state.error.type = 'login';
            } else {
                state.status = 'succeeded';
                state.user = payload;
            }
        })
        builder.addCase(fetchUser.rejected, fetchUserRejected)

        builder.addCase(createUser.pending, fetchUserPending)
        builder.addCase(createUser.fulfilled, (state: UserSliceType, { payload }) => {
            if("message" in payload) {
                state.status = 'failed';
                state.error.message = payload['message'];
                state.error.type = 'register';
            } else {
                state.status = 'succeeded';
                state.user = payload;
            }
        })
        builder.addCase(createUser.rejected, fetchUserRejected)

        builder.addCase(loadUser.pending, fetchUserPending)
        builder.addCase(loadUser.fulfilled, (state: UserSliceType, { payload }) => {
            state.status = 'succeeded';
            state.user = payload;
        })
        builder.addCase(loadUser.rejected, fetchUserRejected)

        builder.addCase(logoutUser.fulfilled, (state: UserSliceType, {}) => {
            state.user = {
                userId: null,
                username: null,
                email: null
            };
            state.error = {
                type: null,
                message: null
            };
            state.status = 'idle';
        })
    }
});

export const userData = (state: {user: UserSliceType}) => state.user.user;
export const userStatus = (state: {user: UserSliceType}) => state.user.status;
export const userError = (state: {user: UserSliceType}) => state.user.error;

export default userSlice.reducer;