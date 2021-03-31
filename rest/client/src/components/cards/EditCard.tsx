import React, {useCallback, useEffect, useRef, useState} from "react";
import {
    match
} from 'react-router-dom';
import {AdditionalDecksWrapper} from "../wrappers/AdditionalDecksWrapper";
import {cardsError, cardsStatus, editCard, fetchCards, singleCard} from "../../store/cardSlice";
import {Form, Formik, FormikProps} from "formik";
import {Button, Stack, useToast} from "@chakra-ui/react";
import {CardInput} from "../inputs/CardInput";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../../store/store";
import {API_PEXELS, CardSliceType, ContextApi, DeckSliceType} from "../../utils/types";
import {decksStatus, singleDeck} from "../../store/deckSlice";
import {history} from "../../App";

interface CardChangeProps {
    match: match<{cardId: string, deckId: string}>
}

export const EditCard: React.FC<CardChangeProps>= ({match}) => {
    const toast = useToast();
    const formikRef = useRef<FormikProps<{ foreignWord: string | null; nativeWord: string | null; includeNativeContext: boolean; }> | null>(null);
    const deckId = Number.parseInt(match.params.deckId);
    const cardId = Number.parseInt(match.params.cardId);

    //Redux state
    const dispatch = useDispatch<AppDispatch>();
    const deck = useSelector((state: {decks: DeckSliceType}) => singleDeck(state, deckId));
    const card = useSelector((state: {cards: CardSliceType}) => singleCard(state, cardId));
    const cardError = useSelector(cardsError);
    const cardStatus = useSelector(cardsStatus);
    const deckStatus = useSelector(decksStatus);

    useEffect(() => {
        if((deck === undefined && deckStatus === 'succeeded') || (card === undefined && cardStatus === 'succeeded')) {
            history.push('/error');
        }
    }, [cardStatus])

    //Additional state for formik
    const [photo, setPhoto] = useState<any>(null);
    const [context, setContext] = useState<ContextApi | null>(null);

    const loadDataApi = useCallback(async () => {
        if(card?.foreignContext) {
            setContext({
                from: card.foreignContext,
                to: card.nativeContext,
                phrase_from: card.foreignWord,
                phrase_to: card.nativeWord
            })
        }
        if(card?.imageId) {
            const imageFromFetch = await fetch(`https://api.pexels.com/v1/photos/${card.imageId}`, {
                    headers: {
                        Authorization: API_PEXELS
                    }
                }
            ).then(response => response.json())

            setPhoto(imageFromFetch);
        }
    }, [card])

    useEffect(() => {
        if(cardStatus === 'idle') {
            dispatch(fetchCards({deckId: deckId}));
        }
        if(cardStatus === 'succeeded') {
            loadDataApi();
            if(cardError.type === 'editCard') {
                toast({
                    title: "Card is updated.",
                    description: "We've updated a card for you.",
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                })
            }
        } else if(cardStatus === 'failed'){
            formikRef.current!.setFieldError('foreignWord', cardError.message as string);
        }
    }, [cardStatus])

    return card ? (
        <Formik
            innerRef={formikRef}
            initialValues={{
                foreignWord: card!.foreignWord,
                nativeWord: card!.nativeWord,
                includeNativeContext: card?.nativeContext ? true : false
            }}
            validateOnMount={true}
            onSubmit={async (values) => {
                await dispatch(editCard({
                    card: {
                        languageId: deck!.language!.languageId,
                        cardId: card!.cardId,
                        foreignWord: values.foreignWord,
                        nativeWord: values.nativeWord,
                        imageId: photo ? photo.id : null,
                        foreignContext: context ? context?.from : null,
                        nativeContext: values.includeNativeContext && context ? context?.to : null
                    }
                }))
            }}
        >
            {({submitForm}) => (
                <Form>
                    <AdditionalDecksWrapper type="deck" title="Edit Card 📝">
                        <Stack spacing={4}>
                            <CardInput
                                photo={photo}
                                setPhoto={setPhoto}
                                context={context}
                                setContext={setContext}
                                deck={deck!}
                            />
                        </Stack>

                        <Button
                            size="lg"
                            alignSelf="flex-end"
                            type="submit"
                            ml={3}
                            onClick={submitForm}
                        >
                            Edit
                        </Button>
                    </AdditionalDecksWrapper>
                </Form>
            )}
        </Formik>
    ) : null
}