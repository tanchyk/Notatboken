import React, {useState} from "react";
import {
    match
} from 'react-router-dom';
import {
    Flex,
    Heading,
    Checkbox,
    Box,
    Text,
    Button,
    Image, IconButton, useToast
} from "@chakra-ui/react";
import {useSelector} from "react-redux";
import {ContextApi, DeckData, FieldProps} from "../../utils/types";
import {Field, Form, Formik} from "formik";
import {UserInput} from "../inputs/UserInput";
import {validateCard} from "../../utils/validationFunctions";
import {ChoosePhoto} from "./ChoosePhoto";
import {ChoosePronunciation} from "./ChoosePronunciation";
import {ChooseContext} from "./ChooseContext";
import {ContextBox} from "./ContexBox";
import { MdDelete} from "react-icons/all";
import {csrfData} from "../../store/csrfSlice";
import {AdditionalDecksWrapper} from "../wrappers/AdditionalDecksWrapper";

export interface AdditionalDeckInfProps {
    match: match<{deckId: string}>
}

export const AddCard: React.FC<AdditionalDeckInfProps> = ({match}) => {
    const toast = useToast();

    const deckId = Number.parseInt(match.params.deckId);
    const [deck, setDeck] = useState<DeckData | null>(null);

    const csrfToken = useSelector(csrfData);

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

    return (
        <Formik
            initialValues={{
                foreignWord: '',
                nativeWord: '',
                includeNativeContext: false
            }}
            onSubmit={async (values, {resetForm, setFieldError}) => {
                const result: {message: string} = await fetch('/api/cards/create-card', {
                    method: 'POST',
                    body: JSON.stringify({
                        deckId,
                        languageId: deck?.language?.languageId,
                        foreignWord: values.foreignWord,
                        nativeWord: values.nativeWord,
                        imageId: photo ? photo.id : null,
                        foreignContext: context ? context?.from : null,
                        nativeContext: values.includeNativeContext ? context?.to : null
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        'CSRF-Token': `${csrfToken}`
                    }
                }).then(response => response.json());

                if(result.message === "Card is created") {
                    resetForm();
                    clear();
                    return toast({
                        title: "Card is created.",
                        description: "We've created a card for you.",
                        status: "success",
                        duration: 9000,
                        isClosable: true,
                    })

                } else {
                    setFieldError('foreignWord', result.message);
                    return toast({
                        title: "Card is not created.",
                        description: "Please, check your data.",
                        status: "error",
                        duration: 9000,
                        isClosable: true,
                    })
                }
            }}
        >
            {({values, isValid, dirty, setFieldValue}) => (
                <Form>
                    <AdditionalDecksWrapper title={`Create card for ${deck?.deckName} 🗳️`} deckId={deckId} setDeck={setDeck}>
                        <Box>
                            <Text fontSize="lg" marginBottom={2} fontWeight="bold">Foreign word</Text>
                            <Field name="foreignWord" validate={validateCard}>
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
                            <Field name="nativeWord" validate={validateCard}>
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

                        <Flex direction="row">
                            <ChoosePhoto
                                nativeWord={values.nativeWord}
                                isDisabled={!(isValid && dirty)}
                                setPhoto={setPhoto}
                            />
                            {
                                photo ? (
                                    <IconButton
                                        aria-label="Delete Photo"
                                        size="sm"
                                        ml={2}
                                        icon={<MdDelete/>}
                                        onClick={() => setPhoto(null)}
                                    />
                                ) : null
                            }
                        </Flex>
                        {
                            photo ? (
                                <Image
                                    w="50%"
                                    src={photo.src.medium}
                                    borderRadius="lg"
                                />
                            ) : null
                        }
                        {
                            deck?.language?.languageId === 6 ? <Heading as="h1" size="sm">😔 Sorry, Notatboken can't add context for Norwegian language</Heading> : (
                                <>
                                    <Flex direction="row">
                                        <ChooseContext
                                            isDisabled={!(isValid && dirty)}
                                            setContext={setContext}
                                            foreignWord={values.foreignWord}
                                            languageName={deck?.language?.languageName}
                                        />
                                        {
                                            context ? (
                                                <IconButton
                                                    aria-label="Delete Context"
                                                    size="sm"
                                                    ml={2}
                                                    icon={<MdDelete/>}
                                                    onClick={() => setContext(null)}
                                                />
                                            ) : null
                                        }
                                    </Flex>
                                    {
                                        context ? (
                                            <ContextBox from={context.from} to={context.to} />
                                        ) : null
                                    }
                                    <Checkbox
                                        isDisabled={!(!!context)}
                                        isChecked={values.includeNativeContext}
                                        onChange={() => setFieldValue('includeNativeContext', !values.includeNativeContext)}
                                    >
                                        Include context in your native language?
                                    </Checkbox>
                                </>
                            )
                        }

                        <ChoosePronunciation isDisabled={true}/>

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