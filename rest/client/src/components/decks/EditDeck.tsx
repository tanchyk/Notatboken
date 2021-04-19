import React, {useEffect} from "react";
import {
    AlertIcon,
    Box,
    Button,
    Heading,
    Stack,
    Alert,
    AlertDescription,
    Flex, IconButton
} from "@chakra-ui/react";
import {Field, Form, Formik} from "formik";
import {AdditionalDecksWrapper} from "../wrappers/AdditionalDecksWrapper";
import {DeckSliceType, FieldProps} from "../../utils/types";
import {UserInput} from "../inputs/UserInput";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../../store/store";
import {cardsData, fetchCards, clearCards} from "../../store/cardSlice";
import {NoDataBox} from "../NoDataBox";
import {SmallCardBox} from "./boxes/SmallCardBox";
import {decksError, editDeck, clearDeckError, singleDeck, decksStatus, decksData} from "../../store/deckSlice";
import {AddIcon} from "@chakra-ui/icons";
import {Link as LinkPage, useRouteMatch} from "react-router-dom";
import {history} from "../../App";
import {DeckNameSchema} from "../../utils/validationFunctions";

export const EditDeck: React.FC = () => {
    const match = useRouteMatch<{deckId: string}>();
    const deckId = Number.parseInt(match.params.deckId);
    const deck = useSelector((state: {decks: DeckSliceType}) => singleDeck(state, deckId));

    //Load cards
    const dispatch = useDispatch<AppDispatch>();
    const decks = useSelector(decksData);
    const deckError = useSelector(decksError);
    const deckStatus = useSelector(decksStatus);
    const cards = useSelector(cardsData);

    useEffect(() => {
        dispatch(clearCards());
        dispatch(clearDeckError());
        dispatch(fetchCards({deckId: deckId}));
    }, [])

    useEffect(() => {
        if(deck === undefined && deckStatus === 'succeeded') {
            history.push('/error');
        }
    }, [deckStatus])

    return (
        <Formik
            initialValues={{
                decksName: ''
            }}
            onSubmit={async (values) => {
                await dispatch(editDeck({deckName: values.decksName, deckId, languageId: deck!.language!.languageId}));
            }}
        >
            {() => (
                <AdditionalDecksWrapper title={`Edit deck ${deck?.deckName}`} type="deck">
                    <Form>
                        <Stack spacing={5} mt={3}>
                            <Heading size="md">{`Change the name of your deck  ${deck?.deckName}`}</Heading>
                            {
                                deckError.type === 'editDeck' ? (
                                    <Alert status="error">
                                        <AlertIcon/>
                                        <AlertDescription fontSize="lg">{deckError.message}</AlertDescription>
                                    </Alert>
                                ) : null
                            }
                            <Box>
                                <Field name="decksName" validate={DeckNameSchema}>
                                    {({field, form}: FieldProps) => (
                                        <UserInput
                                            size="md"
                                            name="decksName"
                                            placeholder="Put your new deck name here"
                                            field={field}
                                            form={form}
                                        />
                                    )}
                                </Field>
                            </Box>

                            <Button type="submit" width="80px">
                                Change
                            </Button>
                        </Stack>
                    </Form>

                    <Stack
                        paddingTop={4}
                        spacing={3}
                    >
                        <Flex direction="row" alignItems="center">
                            <Heading size="md">Cards in your deck:</Heading>
                            {
                                deck ? (
                                    <LinkPage to={`/decks/${deck?.language?.languageName}/add-card/${deck!.deckId}`}>
                                        <IconButton ml={3} aria-label="Close create deck" size="sm" icon={<AddIcon/>}/>
                                    </LinkPage>
                                ) : null
                            }
                        </Flex>
                        {
                            cards.length !== 0 && decks.length !== 0 ? (
                                cards.map((card, index) => <SmallCardBox card={card} deck={deck!} key={index}/>)
                            ) : <NoDataBox type="cards"/>
                        }
                    </Stack>
                </AdditionalDecksWrapper>
            )}
        </Formik>
    );
}