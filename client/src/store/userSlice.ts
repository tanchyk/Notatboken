import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {BasicUser, ErrorDelete, LoginData, RegisterData, UserAuth, UserSliceType} from "../utils/types";
import {serverRequest} from "./requestFunction";

const initialState = {
    user: {
        userId: null,
        name: null,
        username: null,
        email: null,
        languages: null,
        userGoal: null,
        avatar: null,
        createdAt: null
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
        const response = await serverRequest(loginData, getState, '/api/users/login', 'POST');
        return (await response.json()) as UserAuth;
    }
);

//Registration
export const createUser = createAsyncThunk<{message: string}, RegisterData>(
    'user/createUser',
    async (registerData, {getState}) => {
        const response = await serverRequest(registerData, getState, '/api/users/register', 'PUT');
        return (await response.json()) as {message: string};
    }
);

//Send email for password change
export const requestChangePassword = createAsyncThunk<{message: string}, {email: string}>(
    'user/requestChangePassword',
    async (data, {getState}) => {
        const response = await serverRequest(data, getState, '/api/users/forgot-password', 'POST');
        return (await response.json()) as {message: string};
    }
)

//Loading user from token
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
        await serverRequest(_, getState, '/api/users/logout', 'POST');
    }
)

export const updateUser = createAsyncThunk<UserAuth, BasicUser>(
    'user/updateUser',
    async (updateData, {getState}) => {
        const response = await serverRequest(updateData, getState, '/api/users/update-user', 'PUT');
        return (await response.json()) as UserAuth;
    }
)

export const updateGoal = createAsyncThunk<{message: string, userGoal: number}, {userGoal: number}>(
    'user/updateGoal',
    async (updateData, {getState}) => {
        const response = await serverRequest(updateData, getState, '/api/users/update-goal', 'PUT')
            .then(response => {
            if(response.status === 204) {
                return {message: 'Updated', userGoal: updateData.userGoal};
            } else {
                return response.json()
            }
        });
        return response as {message: string, userGoal: number};
    }
)

export const deleteUser = createAsyncThunk<ErrorDelete, {password: string}>(
    'user/deleteUser',
    async (passwordData, {getState}) => {
        const response = await serverRequest(passwordData, getState, '/api/users/delete-user', 'DELETE')
            .then(response => {
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

const nodemailer = (state: UserSliceType, {payload}: { payload: { message: string } }) => {
    if (payload['message'] === 'Created') {
        return Object.assign({}, state, {
            status: 'idle',
            error: {
                message: payload['message'],
                type: 'confirmEmail'
            }
        });
    } else {
        return Object.assign({}, state, {
            status: 'failed',
            error: {
                message: payload['message'],
                type: 'register'
            }
        });
    }
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
        builder.addCase(createUser.fulfilled, nodemailer)
        builder.addCase(createUser.rejected, fetchUserRejected)

        //Create
        builder.addCase(requestChangePassword.pending, fetchUserPending)
        builder.addCase(requestChangePassword.fulfilled, nodemailer)
        builder.addCase(requestChangePassword.rejected, fetchUserRejected)

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

        //Update goal
        builder.addCase(updateGoal.pending, fetchUserPending)
        builder.addCase(updateGoal.fulfilled, (state: UserSliceType, { payload} : {payload: {message: string, userGoal: number}}) => {
            if(payload.message === 'Updated') {
                return Object.assign({}, state, {
                    user: {
                      ...state.user,
                        userGoal: payload.userGoal
                    },
                    error: {type: 'goal'}
                });
            } else {
                return Object.assign({}, state, {
                    status: 'failed',
                    error: {
                        message: payload['message'],
                        type: 'failGoal'
                    }
                });
            }
        })
        builder.addCase(updateGoal.rejected, fetchUserRejected)

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