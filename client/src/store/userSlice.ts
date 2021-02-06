import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {BasicUser, CsrfSliceType, ErrorDelete, LoginData, RegisterData, UserAuth, UserSliceType} from "../utils/types";

const initialState = {
    user: {
        userId: null,
        name: null,
        username: null,
        email: null,
        languages: null
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
        const response = await fetch('/api/users/login', {
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
        const response = await fetch('/api/users/register', {
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
        const response = await fetch('/api/users/single-user', {
            method: 'GET'
        });
        return (await response.json()) as UserAuth;
    }
);

export const logoutUser = createAsyncThunk<void, void>(
    'user/logoutUser',
    async (_,{getState}) => {
        const {csrfToken} = getState() as {csrfToken: CsrfSliceType}
        await fetch('/api/users/logout', {
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
        const response = await fetch('/api/users/update-user', {
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
        const response = await fetch('/api/users/delete-user', {
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
    return Object.assign({}, state, {status: 'loading'});
}

const fetchUserRejected = (state: UserSliceType, {}) => {
    return Object.assign({}, state, {status: 'failed'});
}

//User Slice
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        errorNull: (state: UserSliceType) => {
            state.error.message = null;
            state.error.type = null;
        }
    },
    extraReducers: builder => {
        //Fetch
        builder.addCase(fetchUser.pending, fetchUserPending)
        builder.addCase(fetchUser.fulfilled, (state: UserSliceType, { payload }: { payload: UserAuth }) => {
            if ("message" in payload) {
                return Object.assign({}, state, {
                    status: 'failed',
                    error: {
                        message: payload['message'],
                        type: 'login'
                    }
                });
            } else {
                return Object.assign({}, state, {
                    user: payload,
                    status: 'succeeded'
                });
            }
        })
        builder.addCase(fetchUser.rejected, fetchUserRejected)

        //Create
        builder.addCase(createUser.pending, fetchUserPending)
        builder.addCase(createUser.fulfilled, (state: UserSliceType, { payload }: { payload: UserAuth }) => {
            if ("message" in payload) {
                return Object.assign({}, state, {
                    status: 'failed',
                    error: {
                        message: payload['message'],
                        type:'register'
                    }
                });
            } else {
                return Object.assign({}, state, {
                    user: {...payload, languages: null},
                    status: 'succeeded',
                });
            }
        })
        builder.addCase(createUser.rejected, fetchUserRejected)

        //Load
        builder.addCase(loadUser.pending, fetchUserPending)
        builder.addCase(loadUser.fulfilled, (state: UserSliceType, { payload }) => {
            return Object.assign({}, state, {
                user: payload,
                status: 'succeeded'
            });
        })
        builder.addCase(loadUser.rejected, fetchUserRejected)

        //Logout
        builder.addCase(logoutUser.fulfilled, (state: UserSliceType, {}) => {
            return Object.assign({}, state, initialState);
        })

        //Update
        builder.addCase(updateUser.pending, fetchUserPending)
        builder.addCase(updateUser.fulfilled, (state: UserSliceType, { payload }: { payload: UserAuth }) => {
            if("message" in payload) {
                return Object.assign({}, state, {
                    status: 'failed',
                    error: {
                        message: payload['message'],
                        type: 'update'
                    }
                });
            } else {
                return Object.assign({}, state, {
                    user: payload,
                    status: 'succeeded',
                    error: {
                        message: 'updated',
                        type: null
                    }
                });
            }
        })
        builder.addCase(updateUser.rejected, fetchUserRejected)

        //Delete
        builder.addCase(deleteUser.pending, fetchUserPending)
        builder.addCase(deleteUser.fulfilled, (state: UserSliceType, { payload} : {payload: ErrorDelete}) => {
            if(payload.message === 'Deleted') {
                return Object.assign({}, state, initialState, {error: {type: 'deleteUser'}});
            } else {
                return Object.assign({}, state, {
                    status: 'failed',
                    error: {
                        message: payload['message'],
                        type: 'delete'
                    }
                });
            }
        })
        builder.addCase(deleteUser.rejected, fetchUserRejected)
    }
});

//Selectors
export const userData = (state: {user: UserSliceType}) => state.user.user;
export const userStatus = (state: {user: UserSliceType}) => state.user.status;
export const userError = (state: {user: UserSliceType}) => state.user.error;

export const {errorNull} = userSlice.actions;

export default userSlice.reducer;