import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {CardDispatch, CardSliceType, CsrfSliceType, ErrorDeleteCard} from "../utils/types";
import {Card} from "../../../server/entities/Card";

const initialState = {
    cards: [],
    status: 'idle',
    error: {
        type: null,
        message: null
    }
} as CardSliceType;

//Async reducers
export const fetchCards = createAsyncThunk<Array<Card>, {deckId: number}>(
    'cards/fetchCards',
    async (cardData) => {
        const response = await fetch(`/api/cards/find-cards/${cardData.deckId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return (await response.json()) as Array<Card>;
    }
)

export const addCard = createAsyncThunk<{message: string}, {card: CardDispatch}>(
    'cards/addCard',
    async (cardData, {getState}) => {
        console.log(cardData);
        const {csrfToken} = getState() as {csrfToken: CsrfSliceType};
        const response = await fetch('/api/cards/create-card', {
            method: 'POST',
            body: JSON.stringify(cardData.card),
            headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': `${csrfToken.csrfToken}`
            }
        })
        return (await response.json()) as {message: string};
    }
)

export const editCard = createAsyncThunk<Card, {card: CardDispatch}>(
    'cards/editCard',
    async (cardData, {getState}) => {
        const {csrfToken} = getState() as {csrfToken: CsrfSliceType};
        console.log(cardData.card)
        const response = await fetch('/api/cards/edit-card', {
            method: 'PUT',
            body: JSON.stringify(cardData.card),
            headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': `${csrfToken.csrfToken}`
            }
        });
        return (await response.json()) as Card;
    }
)

export const deleteCard = createAsyncThunk<ErrorDeleteCard, {cardId: number}>(
    'cards/deleteCard',
    async (cardData, {getState}) => {
        const {csrfToken} = getState() as {csrfToken: CsrfSliceType};
        const response = await fetch('/api/cards/delete-card', {
            method: 'DELETE',
            body: JSON.stringify(cardData),
            headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': `${csrfToken.csrfToken}`
            }
        }).then(response => {
            if(response.status === 204) {
                return {
                    message: 'Deleted',
                    cardId: cardData.cardId
                };
            } else {
                return response.json()
            }
        });
        return (response) as ErrorDeleteCard;
    }
);

//Extra Reducers
const fetchCardPending = (state: CardSliceType, {}) => {
    return Object.assign({}, state, {status: 'loading'});
}

const fetchCardRejected = (state: CardSliceType, {}) => {
    return Object.assign({}, state, {status: 'failed'});
}

const cardSlice = createSlice({
    name: 'cards',
    initialState,
    reducers: {
        clearCards:(state: CardSliceType) => {
            return Object.assign({}, state, initialState);
        }
    },
    extraReducers: builder => {
        //Fetch
        builder.addCase(fetchCards.pending, fetchCardPending)
        builder.addCase(fetchCards.fulfilled, (state: CardSliceType, { payload }: { payload: Array<Card> }) => {
            if ("message" in payload) {
                return Object.assign({}, state, {
                    status: 'failed',
                    error: {
                        type: 'loadCards',
                        message: payload['message']
                    }
                });
            } else {
                return Object.assign({}, state, {
                    cards: state.cards.concat(payload),
                    status: 'succeeded'
                });
            }
        })
        builder.addCase(fetchCards.rejected, fetchCardRejected)

        //Add
        builder.addCase(addCard.pending, fetchCardPending)
        builder.addCase(addCard.fulfilled, (state: CardSliceType, { payload }: { payload: {message: string} }) => {
            console.log('Message', payload.message)
            if (payload.message === "Card is created") {
                return Object.assign({}, state, {
                    status: 'succeeded',
                    error: {
                        type: 'createCard',
                        message: payload['message']
                    }
                });
            } else {
                return Object.assign({}, state, {
                    status: 'failed',
                    error: {
                        type: 'failedCreateCard',
                        message: payload['message']
                    }
                });
            }
        })
        builder.addCase(addCard.rejected, fetchCardRejected)

        //Edit
        builder.addCase(editCard.pending, fetchCardPending)
        builder.addCase(editCard.fulfilled, (state: CardSliceType, { payload }: { payload: Card }) => {
            if ("message" in payload) {
                return Object.assign({}, state, {
                    status: 'failed',
                    error: {
                        type: 'editCard',
                        message: payload['message']
                    }
                });
            } else {
                return Object.assign({}, state, {
                    cards: state.cards.map(card => {
                        if(card.cardId === payload.cardId) {
                            return payload;
                        } else {
                            return card;
                        }
                    }),
                    status: 'succeeded'
                });
            }
        })
        builder.addCase(editCard.rejected, fetchCardRejected)

        //Delete
        builder.addCase(deleteCard.pending, fetchCardPending)
        builder.addCase(deleteCard.fulfilled, (state: CardSliceType, { payload} : {payload: ErrorDeleteCard}) => {
            if(payload.message === 'Deleted') {
                return Object.assign({}, state,{
                    cards: state.cards.filter(card => card.cardId !== payload!.cardId),
                    status: 'succeeded'
                }, {error: {type: 'deleteDeck'}});
            } else {
                return;
            }
        })
        builder.addCase(deleteCard.rejected, fetchCardRejected)
    }
})

export const cardsData = (state: {cards: CardSliceType}) => state.cards.cards;
export const cardsStatus = (state: {cards: CardSliceType}) => state.cards.status;
export const cardsError = (state: {cards: CardSliceType}) => state.cards.error;

export const {clearCards} = cardSlice.actions;

export default cardSlice.reducer;