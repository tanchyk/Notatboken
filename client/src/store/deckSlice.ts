import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {CsrfSliceType, DeckSliceType, ErrorDelete} from "../utils/types";
import {Deck} from "../../../server/entities/Deck";

const initialState = {
    decks: [],
    status: 'idle',
    error: {
        type: null,
        message: null
    }
} as DeckSliceType;

//Async reducers
export const fetchDecks = createAsyncThunk<Array<Deck>, {languageId: number}>(
    'decks/fetchDecks',
    async (deckData) => {
        const response = await fetch(`/api/decks/find-decks/${deckData.languageId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return (await response.json()) as Array<Deck>;
    }
);

export const addDeck = createAsyncThunk<Deck, {deckName: string, languageId: number}>(
    'decks/addDeck',
    async (deckData, {getState}) => {
        const {csrfToken} = getState() as {csrfToken: CsrfSliceType};
        const response = await fetch('/api/decks/create-deck', {
            method: 'POST',
            body: JSON.stringify(deckData),
            headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': `${csrfToken.csrfToken}`
            }
        });
        return (await response.json()) as Deck;
    }
);

export const deleteDeck = createAsyncThunk<ErrorDelete, {deckId: number}>(
    'decks/deleteDeck',
    async (deckData, {getState}) => {
    const {csrfToken} = getState() as {csrfToken: CsrfSliceType};
        const response = await fetch('/api/decks/delete-deck', {
            method: 'DELETE',
            body: JSON.stringify(deckData),
            headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': `${csrfToken.csrfToken}`
            }
        }).then(response => {
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

const deckSlice = createSlice({
    name: 'decks',
    initialState,
    reducers: {
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
        builder.addCase(fetchDecks.fulfilled, (state: DeckSliceType, { payload }: { payload: Array<Deck> }) => {
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
                    decks: state.decks.concat(payload),
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
                    decks: state.decks.concat(payload),
                    status: 'succeeded',
                    error: {
                        type: 'createDeck',
                        message: null
                    }
                });
            }
        })
        builder.addCase(addDeck.rejected, fetchDeckRejected)

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
export const decksStatus = (state: {decks: DeckSliceType}) => state.decks.status;
export const decksError = (state: {decks: DeckSliceType}) => state.decks.error;

export const {clearDeckError, clearDecks} = deckSlice.actions;

export default deckSlice.reducer;