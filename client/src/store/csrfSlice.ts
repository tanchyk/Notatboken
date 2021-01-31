import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {CsrfSliceType} from "../utils/types";

const initialState = {
    csrfToken: null
} as CsrfSliceType;

//Async reducers
export const fetchToken = createAsyncThunk<CsrfSliceType, void>(
    'user/fetchToken',
    async () => {
        const response = await fetch('/api/csrf-token', {
            method: 'GET'
        });
        return (await response.json()) as CsrfSliceType;
    }
);

const csrfSlice = createSlice({
    name: 'csrfToken',
    initialState,
    reducers: {

    },
    extraReducers: builder => {
        builder.addCase(fetchToken.fulfilled, (state: CsrfSliceType, { payload }) => {
            state.csrfToken = payload.csrfToken;
        })
    }
});

export const csrfData = (state: {csrfToken: CsrfSliceType}) => state.csrfToken.csrfToken;

export default csrfSlice.reducer;