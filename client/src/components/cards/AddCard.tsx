import React, {useEffect, useState} from "react";
import {
    match
} from 'react-router-dom';
import {
    Heading,
    Stack,
    Box,
    Text,
    Button,
    Image
} from "@chakra-ui/react";
import {useSelector} from "react-redux";
import {decksData} from "../../store/deckSlice";
import {DeckData, FieldProps} from "../../utils/types";
import {history} from "../../App";
import {useStyleConfig} from "@chakra-ui/react";
import {Field, Form, Formik} from "formik";
import {UserInput} from "../inputs/UserInput";
import {validateUsername} from "../../utils/validationFunctions";
import {ChoosePhoto} from "./ChoosePhoto";
import {ChoosePronunciation} from "./ChoosePronunciation";
import {ChooseContext} from "./ChooseContext";

interface AddCardProps {
    match: match<{deckId: string}>
}

export const AddCard: React.FC<AddCardProps> = ({match}) => {
    const styleStack = useStyleConfig("Stack");
    styleStack.borderLeftWidth = "6px";

    const deckId = Number.parseInt(match.params.deckId);
    const [deck, setDeck] = useState<DeckData | null>(null);

    const decks = useSelector(decksData);

    useEffect(() => {
        if(decks.length > 0) {
            let checkDeck = null;
            for(const deckTmp of decks) {
                if(deckTmp.deckId === deckId) {
                    checkDeck = deckTmp;
                    break;
                }
            }

            if(checkDeck === null) {
                history.push('/error');
            }

            setDeck(checkDeck);
        }
    }, [decks])

    const [photo, setPhoto] = useState<any>();

    const clear = () => {
        if(photo) {
            setPhoto(undefined);
        }
    }

    return (
        <Formik
            initialValues={{
                foreignWord: '',
                nativeWord: ''
            }}
            onSubmit={async (values) => {
                console.log(values);
            }}
        >
            {({values, isValid, dirty}) => (
                <Form>
                    <Stack
                        sx={styleStack}
                        marginTop={8}
                        marginBottom={8}
                        padding={10}
                        paddingLeft={12}
                    >
                        <Heading as="h1" size="lg" mb={8}>{`Create card for ${deck?.deckName} 🗃️`}</Heading>
                        <Stack spacing={6} w="75%">

                            <Box>
                                <Text fontSize="lg" marginBottom={2} fontWeight="bold">Foreign word</Text>
                                <Field name="foreignWord" validate={validateUsername}>
                                    {({field, form}: FieldProps) => (
                                        <UserInput
                                            size="md"
                                            name="foreignWord"
                                            field={field}
                                            form={form}
                                        />
                                    )}
                                </Field>
                            </Box>

                            <Box>
                                <Text fontSize="lg" marginBottom={3} fontWeight="bold">Native word</Text>
                                <Field name="nativeWord" validate={validateUsername}>
                                    {({field, form}: FieldProps) => (
                                        <UserInput
                                            size="md"
                                            name="nativeWord"
                                            field={field}
                                            form={form}
                                        />
                                    )}
                                </Field>
                            </Box>

                            <ChoosePhoto nativeWord={values.nativeWord} isDisabled={!(isValid && dirty)} setPhoto={setPhoto}/>
                            {
                                photo ? (
                                    <Image
                                        w="50%"
                                        src={photo.src.medium}
                                        borderRadius="lg"
                                    />
                                ) : null
                            }

                            <ChoosePronunciation isDisabled={!(isValid && dirty)}/>

                            <ChooseContext isDisabled={!(isValid && dirty)}/>

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
                        </Stack>
                    </Stack>
                </Form>
            )}
        </Formik>
    );
}