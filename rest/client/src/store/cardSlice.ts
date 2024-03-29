import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {
    CardData,
    CardDispatch,
    CardSliceType,
    ErrorDeleteCard,
    Proficiency,
    StreakSliceType
} from "../utils/types";
import {getRequest, serverRequest} from "./requestFunction";

const initialState = {
    cards: [],
    status: 'idle',
    error: {
        type: null,
        message: null
    }
} as CardSliceType;

//Async reducers
export const fetchCards = createAsyncThunk<Array<CardData>, {deckId: number}>(
    'cards/fetchCards',
    async (cardData) => {
        const response = await getRequest(`/cards/find-cards/${cardData.deckId}`);
        return (await response.json()) as Array<CardData>;
    }
)

export const fetchCardsForReview = createAsyncThunk<Array<CardData>, {deckId: number}>(
    'cards/fetchCardsForReview',
    async (cardData) => {
        const response = await getRequest(`/cards/find-review/${cardData.deckId}`);
        return (await response.json()) as Array<CardData>;
    }
)

export const addCard = createAsyncThunk<{message: string}, {card: CardDispatch}>(
    'cards/addCard',
    async (cardData, {getState}) => {
        const response = await serverRequest(cardData.card, getState, '/cards/create-card', 'POST');
        return (await response.json()) as {message: string};
    }
)

export const editCard = createAsyncThunk<CardData, {card: CardDispatch}>(
    'cards/editCard',
    async (cardData, {getState}) => {
        const response = await serverRequest(cardData.card, getState, '/cards/edit-card', 'PUT');
        return (await response.json()) as CardData;
    }
)

export const editCardStatus = createAsyncThunk<{card: CardData, notification: null | string}, {cardId: number, proficiency: Proficiency, userGoal: number}>(
    'cards/editCardStatus',
    async (cardData, {getState}) => {
        const check = getState() as {streak: StreakSliceType};
        const response = await serverRequest({...cardData, today: check.streak.today}, getState, '/cards/change-status', 'PUT');
        return (await response.json()) as {card: CardData, notification: null | string};
    }
)

export const deleteCard = createAsyncThunk<ErrorDeleteCard, {cardId: number}>(
    'cards/deleteCard',
    async (cardData, {getState}) => {
        const response = await serverRequest({cardId: cardData.cardId}, getState, '/cards/delete-card', 'DELETE')
            .then(response => {
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
        clearCards: (state: CardSliceType) => {
            return Object.assign({}, state, initialState);
        },
        clearCardError: (state: CardSliceType) => {
            return Object.assign({}, state, {
                error: {
                    type: null,
                    message: null
                }
            });
        }
    },
    extraReducers: builder => {
        //Fetch
        builder.addCase(fetchCards.pending, fetchCardPending)
        builder.addCase(fetchCards.fulfilled, (state: CardSliceType, { payload }: { payload: Array<CardData> }) => {
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
                    cards: state.cards.concat(payload.sort(
                        (cardA, cardB) => new Date(cardA.reviewDate!).getTime() - new Date(cardB.reviewDate!).getTime()
                        )
                    ),
                    status: 'succeeded'
                });
            }
        })
        builder.addCase(fetchCards.rejected, fetchCardRejected)

        //Fetch for review
        builder.addCase(fetchCardsForReview.pending, fetchCardPending)
        builder.addCase(fetchCardsForReview.fulfilled, (state: CardSliceType, { payload }: { payload: Array<CardData> }) => {
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
                    cards: state.cards.concat(payload.sort(
                        (cardA, cardB) => new Date(cardA.reviewDate!).getTime() - new Date(cardB.reviewDate!).getTime()
                        )
                    ),
                    status: 'succeeded'
                });
            }
        })
        builder.addCase(fetchCardsForReview.rejected, fetchCardRejected)

        //Add
        builder.addCase(addCard.pending, fetchCardPending)
        builder.addCase(addCard.fulfilled, (state: CardSliceType, { payload }: { payload: {message: string} }) => {
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
        builder.addCase(editCard.fulfilled, (state: CardSliceType, { payload }: { payload: CardData }) => {
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
                    status: 'succeeded',
                    error: {
                        type: 'editCard'
                    }
                });
            }
        })
        builder.addCase(editCard.rejected, fetchCardRejected)

        //Edit status
        builder.addCase(editCardStatus.pending, fetchCardPending)
        builder.addCase(editCardStatus.fulfilled, (state: CardSliceType, { payload }: { payload: {card: CardData, notification: null | string} }) => {
            if ("message" in payload) {
                return Object.assign({}, state, {
                    status: 'failed',
                    error: {
                        type: 'editCard',
                        message: payload['message']
                    }
                });
            } else {
                const newState: CardSliceType = {
                    cards: state.cards.filter(card => card.cardId !== payload.card.cardId),
                    status: 'succeeded',
                    error: {
                        type: null,
                        message: null
                    }
                }

                if (new Date(payload.card.reviewDate!).getDate() === new Date().getDate()) {
                    newState.cards.push(payload.card);
                }

                if(payload.notification === 'Goal Set') {
                    newState.error.message = payload.notification;
                }

                return Object.assign({}, state, newState);
            }
        })
        builder.addCase(editCardStatus.rejected, fetchCardRejected)

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
export const singleCard = (state: {cards: CardSliceType}, cardId: number) => state.cards.cards.find(card => card.cardId === cardId);
export const cardsStatus = (state: {cards: CardSliceType}) => state.cards.status;
export const cardsError = (state: {cards: CardSliceType}) => state.cards.error;

export const {clearCards, clearCardError} = cardSlice.actions;

export default cardSlice.reducer;