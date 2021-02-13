import React, {useEffect, useRef, useState} from "react";
import {
    match
} from 'react-router-dom';
import {Box, Button, useToast} from "@chakra-ui/react";
import {useDispatch, useSelector} from "react-redux";
import {ContextApi, DeckData} from "../../utils/types";
import {Form, Formik, FormikProps} from "formik";
import {AdditionalDecksWrapper} from "../wrappers/AdditionalDecksWrapper";
import {CardInput} from "../inputs/CardInput";
import {AppDispatch} from "../../store/store";
import {addCard, cardsError} from "../../store/cardSlice";

export interface AdditionalDeckInfProps {
    match: match<{deckId: string}>
}

export const CreateCard: React.FC<AdditionalDeckInfProps> = ({match}) => {
    const toast = useToast();
    const formikRef = useRef<FormikProps<{ foreignWord: string; nativeWord: string; includeNativeContext: boolean; }> | null>(null);

    const deckId = Number.parseInt(match.params.deckId);
    const [deck, setDeck] = useState<DeckData | null>(null);

    const dispatch = useDispatch<AppDispatch>();
    const cardError = useSelector(cardsError);

    //State for keeping data that was selected by user
    const [photo, setPhoto] = useState<any>(null);
    const [context, setContext] = useState<ContextApi | null>(null);

    const clear = () => {
        if(photo) {
            setPhoto(null);
        }
        if(context) {
            setContext(null)
        }
    }

    useEffect(() => {
        if(cardError.type === 'createCard') {
            formikRef.current!.resetForm();
            clear();
            toast({
                title: "Card is created.",
                description: "We've created a card for you.",
                status: "success",
                duration: 9000,
                isClosable: true,
            })

        } else if(cardError.type === 'failedCreateCard'){
            formikRef.current!.setFieldError('foreignWord', cardError.message as string);
            toast({
                title: "Card is not created.",
                description: "Please, check your data.",
                status: "error",
                duration: 9000,
                isClosable: true,
            })
        }
    }, [cardError])

    return (
        <Formik
            innerRef={formikRef}
            initialValues={{
                foreignWord: '',
                nativeWord: '',
                includeNativeContext: false
            }}
            isInitialValid={false}
            onSubmit={async (values) => {
                await dispatch(addCard({
                    card: {
                        languageId: deck?.language?.languageId ? deck?.language?.languageId : null,
                        deckId,
                        foreignWord: values.foreignWord,
                        nativeWord: values.nativeWord,
                        imageId: photo ? photo.id : null,
                        foreignContext: context ? context?.from : null,
                        nativeContext: values.includeNativeContext && context ? context?.to : null
                    }
                }))
            }}

        >
            {({}) => (
                <Form>
                    <AdditionalDecksWrapper title={`Create card for ${deck?.deckName} 🗳️`} deckId={deckId} setDeck={setDeck}>
                        <CardInput
                            photo={photo}
                            setPhoto={setPhoto}
                            context={context}
                            setContext={setContext}
                            deck={deck}
                        />

                        <Box alignSelf="flex-end">
                            <Button
                                variant="outline"
                                size="lg"
                                width="80px"
                                mr={3}
                                type="reset"
                                onClick={() => clear()}
                            >
                                Clear
                            </Button>
                            <Button
                                size="lg"
                                width="120px"
                                type="submit"
                            >
                                Create Card
                            </Button>
                        </Box>
                    </AdditionalDecksWrapper>
                </Form>
            )}
        </Formik>
    );
}