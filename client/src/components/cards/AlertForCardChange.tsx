import React, {useEffect, useRef, useState} from "react";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,Button, Stack
} from "@chakra-ui/react";
import {API_PEXELS, CardData, ContextApi, DeckData} from "../../utils/types";
import {Form, Formik, FormikProps} from "formik";
import {CardInput} from "../inputs/CardInput";
import {cardsError, cardsStatus, editCard} from "../../store/cardSlice";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../../store/store";

interface AlertForCardChangeProps {
    card: CardData;
    isOpen: boolean;
    onClose: () => void;
    cancelRef: React.RefObject<HTMLButtonElement>;
    deck: DeckData;
}

export const AlertForCardChange: React.FC<AlertForCardChangeProps> = ({card, isOpen, onClose, cancelRef, deck}) => {
    const formikRef = useRef<FormikProps<{ foreignWord: string | null; nativeWord: string | null; includeNativeContext: boolean; }> | null>(null);

    //Redux state
    const dispatch = useDispatch<AppDispatch>();
    const cardError = useSelector(cardsError);
    const cardStatus = useSelector(cardsStatus);

    //Additional state for formik
    const [photo, setPhoto] = useState<any>(null);
    const [context, setContext] = useState<ContextApi | null>(null);

    const loadDataApi = async () => {
        if(card.foreignContext) {
            setContext({
                from: card.foreignContext,
                to: card.nativeContext,
                phrase_from: card.foreignWord,
                phrase_to: card.nativeWord
            })
        }
        if(card.imageId) {
            const imageFromFetch = await fetch(`https://api.pexels.com/v1/photos/${card.imageId}`, {
                    headers: {
                        Authorization: API_PEXELS
                    }
                }
            ).then(response => response.json())

            setPhoto(imageFromFetch);
        }
    }

    useEffect(() => {
        if(cardStatus === 'succeeded') {
            loadDataApi();
            onClose();
        } else if(cardStatus === 'failed'){
            formikRef.current!.setFieldError('foreignWord', cardError.message as string);
        }
    }, [cardStatus])

    return (
        <Formik
            innerRef={formikRef}
            initialValues={{
                foreignWord: card.foreignWord,
                nativeWord: card.nativeWord,
                includeNativeContext: card.nativeContext ? true : false
            }}
            validateOnMount={true}
            onSubmit={async (values) => {
                await dispatch(editCard({
                    card: {
                        languageId: deck.language!.languageId,
                        cardId: card.cardId,
                        foreignWord: values.foreignWord,
                        nativeWord: values.nativeWord,
                        imageId: photo ? photo.id : null,
                        foreignContext: context ? context?.from : null,
                        nativeContext: values.includeNativeContext && context ? context?.to : null
                    }
                }))
            }}
        >
            {({ submitForm}) => (
                <Form>
                    <AlertDialog
                        isOpen={isOpen}
                        leastDestructiveRef={cancelRef}
                        onClose={onClose}
                        size="2xl"
                    >
                        <AlertDialogOverlay>
                            <AlertDialogContent>
                                <AlertDialogHeader fontSize="2xl" fontWeight="bold">
                                    Edit Card 📝
                                </AlertDialogHeader>

                                <AlertDialogBody fontSize="lg">
                                    <Stack spacing={4}>
                                        <CardInput
                                            photo={photo}
                                            setPhoto={setPhoto}
                                            context={context}
                                            setContext={setContext}
                                            deck={deck}
                                        />
                                    </Stack>
                                </AlertDialogBody>

                                <AlertDialogFooter>
                                    <Button
                                        variant="outline"
                                        ref={cancelRef}
                                        onClick={onClose}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        w="80px"
                                        type="submit"
                                        ml={3}
                                        onClick={submitForm}
                                    >
                                        Edit
                                    </Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialogOverlay>
                    </AlertDialog>
                </Form>
            )}
        </Formik>
    );
}