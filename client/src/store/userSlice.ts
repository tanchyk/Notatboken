import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {BasicUser, CsrfSliceType, ErrorDelete, LoginData, RegisterData, UserAuth, UserSliceType} from "../utils/types";

const initialState = {
    user: {
        userId: null,
        name: null,
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

export const updateUser = createAsyncThunk<UserAuth, BasicUser>(
    'user/updateUser',
    async (updateData, {getState}) => {
        const {csrfToken} = getState() as {csrfToken: CsrfSliceType};
        const response = await fetch('/users/update-user', {
            method: 'PUT',
            body: JSON.stringify(updateData),
            headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': `${csrfToken.csrfToken}`
            }
        });
        return (await response.json()) as UserAuth;
    }
)

export const deleteUser = createAsyncThunk<ErrorDelete, {password: string}>(
    'user/deleteUser',
    async (passwordData, {getState}) => {
        const {csrfToken} = getState() as {csrfToken: CsrfSliceType};
        const response = await fetch('/users/delete-user', {
            method: 'DELETE',
            body: JSON.stringify(passwordData),
            headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': `${csrfToken.csrfToken}`
            }
        }).then(response => {
            if(response.status === 204) {
                return {message: 'Deleted'};
            } else {
                return response.json()
            }
        });
        return (response) as ErrorDelete;
    }
)

//Extra Reducers
const fetchUserPending = (state: UserSliceType, {}) => {
    state.status = 'loading';
}

const fetchUserFulfilled = (state: UserSliceType, { payload }: { payload: UserAuth }) => {
    if("message" in payload) {
        state.status = 'failed';
        state.error.message = payload['message'];
        state.error.type = 'update';
    } else {
        state.status = 'succeeded';
        state.user = payload;
    }
}

const fetchUserRejected = (state: UserSliceType, {}) => {
    state.status = 'failed';
}

const fetchUserDataVoid = (state: UserSliceType, {}) => {
   Object.assign(state, initialState);
}

//User Slice
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {

    },
    extraReducers: builder => {
        //Fetch
        builder.addCase(fetchUser.pending, fetchUserPending)
        builder.addCase(fetchUser.fulfilled, (state: UserSliceType, { payload }: { payload: UserAuth }) => {
            if ("message" in payload) {
                state.status = 'failed';
                state.error.message = payload['message'];
                state.error.type = 'login';
            } else {
                state.status = 'succeeded';
                state.user = payload;
            }
        })
        builder.addCase(fetchUser.rejected, fetchUserRejected)

        //Create
        builder.addCase(createUser.pending, fetchUserPending)
        builder.addCase(createUser.fulfilled, (state: UserSliceType, { payload }: { payload: UserAuth }) => {
            if ("message" in payload) {
                state.status = 'failed';
                state.error.message = payload['message'];
                state.error.type = 'register';
            } else {
                state.status = 'succeeded';
                state.user = payload;
            }
        })
        builder.addCase(createUser.rejected, fetchUserRejected)

        //Load
        builder.addCase(loadUser.pending, fetchUserPending)
        builder.addCase(loadUser.fulfilled, (state: UserSliceType, { payload }) => {
            state.status = 'succeeded';
            state.user = payload;
        })
        builder.addCase(loadUser.rejected, fetchUserRejected)

        //Logout
        builder.addCase(logoutUser.fulfilled, fetchUserDataVoid)

        //Update
        builder.addCase(updateUser.pending, fetchUserPending)
        builder.addCase(updateUser.fulfilled, fetchUserFulfilled)
        builder.addCase(updateUser.rejected, fetchUserRejected)

        //Delete
        builder.addCase(deleteUser.pending, fetchUserPending)
        builder.addCase(deleteUser.fulfilled, (state: UserSliceType, { payload} : {payload: ErrorDelete}) => {
            if(payload.message === 'Deleted') {
                state = Object.assign({}, initialState);
                state.error.type = 'delete';
            } else {
                state.status = 'failed';
                state.error.message = payload['message'];
                state.error.type = 'delete';
            }
        })
        builder.addCase(deleteUser.rejected, fetchUserRejected)
    }
});

export const userData = (state: {user: UserSliceType}) => state.user.user;
export const userStatus = (state: {user: UserSliceType}) => state.user.status;
export const userError = (state: {user: UserSliceType}) => state.user.error;

export default userSlice.reducer;