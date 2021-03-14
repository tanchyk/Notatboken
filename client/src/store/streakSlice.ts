import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {StreakSliceType} from "../utils/types";
import {getRequest} from "./requestFunction";

const initialState = {
    streak: 0,
    today: false
} as StreakSliceType;

//Async reducers
export const fetchStreak = createAsyncThunk<StreakSliceType, void>(
    'streak/fetchStreak',
    async () => {
        const response = await getRequest('/statistics/get-streak');
        return (await response.json()) as StreakSliceType;
    }
);

const streakSlice = createSlice({
    name: 'streak',
    initialState,
    reducers: {
        complete: (state: StreakSliceType) => {
            console.log(state.streak)
            state.streak = state.streak! + 1;
            state.today = true;
        }
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

export const {complete} = streakSlice.actions;

export default streakSlice.reducer;