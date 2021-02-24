import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {DeckData, DeckSliceType, ErrorDelete} from "../utils/types";
import {serverRequest} from "./requestFunction";

const initialState = {
    decks: [],
    status: 'idle',
    error: {
        type: null,
        message: null
    }
} as DeckSliceType;

//Async reducers
export const fetchDecks = createAsyncThunk<Array<DeckData>, {languageId: number}>(
    'decks/fetchDecks',
    async (deckData) => {
        const response = await fetch(`/api/decks/find-decks/${deckData.languageId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return (await response.json()) as Array<DeckData>;
    }
);

export const addDeck = createAsyncThunk<DeckData, {deckName: string, languageId: number}>(
    'decks/addDeck',
    async (deckData, {getState}) => {
        const response = await serverRequest(deckData, getState, '/api/decks/create-deck', 'POST');
        return (await response.json()) as DeckData;
    }
);

export const editDeck = createAsyncThunk<DeckData, {deckName: string, deckId: number, languageId: number}>(
    'decks/editDeck',
        async (deckData, {getState}) => {
            const response = await serverRequest(deckData, getState, '/api/decks/edit-deck', 'PUT');
            return (await response.json()) as DeckData;
        }
)

export const deleteDeck = createAsyncThunk<ErrorDelete, {deckId: number}>(
    'decks/deleteDeck',
    async (deckData, {getState}) => {
        await serverRequest(deckData, getState, '/api/decks/delete-deck', 'DELETE')
        const response = await serverRequest(deckData, getState, '/api/decks/delete-deck', 'DELETE')
            .then(response => {
            if(response.status === 204) {
                return {
                    message: 'Deleted',
                    deckId: deckData.deckId
                };
            } else {
                return response.json()
            }
        });
        return (response) as ErrorDelete;
    }
);

//Extra Reducers
const fetchDeckPending = (state: DeckSliceType, {}) => {
    return Object.assign({}, state, {status: 'loading'});
}

const fetchDeckRejected = (state: DeckSliceType, {}) => {
    return Object.assign({}, state, {status: 'failed'});
}

const changeAmountCards = (state: DeckSliceType, action: PayloadAction<number>, number: number) => {
    const deck = state.decks.find(deck => deck.deckId === action.payload);
    deck!.amountOfCards = deck!.amountOfCards! + number;
    Object.assign(state, state.decks.map(deckF => {
        if(deckF.deckId === action.payload) {
            return deck;
        } else {
            return deckF;
        }
    }))
}

const deckSlice = createSlice({
    name: 'decks',
    initialState,
    reducers: {
        decreaseCardAmount: (state: DeckSliceType, action: PayloadAction<number>) => {
            changeAmountCards(state,action,-1);
        },
        increaseCardAmount: (state: DeckSliceType, action: PayloadAction<number>) => {
            changeAmountCards(state, action, 1);
        },
        clearDeckError: (state: DeckSliceType) => {
            if(state.decks.length > 0) {
                state.status = 'succeeded';
            } else {
                state.status = 'idle';
            }
            state.error.message = null;
            state.error.type = null;
        },
        clearDecks: (state: DeckSliceType) => {
            return Object.assign({}, state, initialState);
        }
    },
    extraReducers: builder => {
        //Fetch
        builder.addCase(fetchDecks.pending, fetchDeckPending)
        builder.addCase(fetchDecks.fulfilled, (state: DeckSliceType, { payload }: { payload: Array<DeckData> }) => {
            if ("message" in payload) {
                return Object.assign({}, state, {
                    status: 'failed',
                    error: {
                        type: 'loadDecks',
                        message: payload['message']
                    }
                });
            } else {
                return Object.assign({}, state, {
                    decks: state.decks.concat(payload.sort(
                        (deckA, deckB) => deckA.deckName!.localeCompare(deckB.deckName!)
                    )),
                    status: 'succeeded'
                });
            }
        })
        builder.addCase(fetchDecks.rejected, fetchDeckRejected)

        //Create
        builder.addCase(addDeck.pending, fetchDeckPending)
        builder.addCase(addDeck.fulfilled, (state: DeckSliceType, { payload }) => {
            if ("message" in payload) {
                return Object.assign({}, state, {
                    status: 'failed',
                    error: {
                        message: payload['message'],
                        type: 'notCreateDeck'
                    }
                });
            } else {
                return Object.assign({}, state, {
                    decks: state.decks.concat(payload).sort(
                        (deckA, deckB) => deckA.deckName!.localeCompare(deckB.deckName!)
                    ),
                    status: 'succeeded',
                    error: {
                        type: 'createDeck',
                        message: null
                    }
                });
            }
        })
        builder.addCase(addDeck.rejected, fetchDeckRejected)

        //Update
        builder.addCase(editDeck.pending, fetchDeckPending)
        builder.addCase(editDeck.fulfilled, (state: DeckSliceType, { payload }: { payload: DeckData | {message: string} }) => {
            if("message" in payload) {
                return Object.assign({}, state, {
                    status: 'failed',
                    error: {
                        type: 'editDeck',
                        message: payload['message']
                    }
                });
            } else {
                return Object.assign({}, state, {
                    decks: state.decks.map(deck => {
                        if(deck.deckId === payload.deckId) {
                            return payload;
                        } else {
                            return deck;
                        }
                    }),
                    status: 'succeeded',
                    error: {
                        message: null,
                        type: null
                    }
                });
            }
        })
        builder.addCase(editDeck.rejected, fetchDeckRejected)

        //Delete
        builder.addCase(deleteDeck.pending, fetchDeckPending)
        builder.addCase(deleteDeck.fulfilled, (state: DeckSliceType, { payload} : {payload: ErrorDelete}) => {
            if(payload.message === 'Deleted') {
                return Object.assign({}, state,{
                    decks: state.decks.filter(deck => deck.deckId !== payload!.deckId),
                    status: 'succeeded'
                }, {error: {type: 'deleteDeck'}});
            } else {
                return;
            }
        })
        builder.addCase(deleteDeck.rejected, fetchDeckRejected)
    }
});

export const decksData = (state: {decks: DeckSliceType}) => state.decks.decks;
export const singleDeck = (state: {decks: DeckSliceType}, deckId: number) => state.decks.decks.find(deck => deck.deckId === deckId);
export const decksStatus = (state: {decks: DeckSliceType}) => state.decks.status;
export const decksError = (state: {decks: DeckSliceType}) => state.decks.error;

export const {clearDeckError, clearDecks, increaseCardAmount, decreaseCardAmount} = deckSlice.actions;

export default deckSlice.reducer;