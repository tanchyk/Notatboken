import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {StreakSliceType} from "../utils/types";

const initialState = {
    streak: null,
    today: false
} as StreakSliceType;

//Async reducers
export const fetchStreak = createAsyncThunk<StreakSliceType, void>(
    'streak/fetchStreak',
    async () => {
        const response = await fetch('/api/statistics/get-streak', {
            method: 'GET'
        });
        return (await response.json()) as StreakSliceType;
    }
);

const streakSlice = createSlice({
    name: 'streak',
    initialState,
    reducers: {

    },
    extraReducers: builder => {
        builder.addCase(fetchStreak.fulfilled, (state: StreakSliceType, { payload }) => {
            state.streak = payload.streak;
            state.today = payload.today;
        })
    }
});

export const streakData = (state: {streak: StreakSliceType}) => state.streak.streak;
export const todayStreak = (state: {streak: StreakSliceType}) => state.streak.today;

export default streakSlice.reducer;