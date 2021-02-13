import React from "react";
import {Field, FormikValues, useFormikContext} from "formik";
import {Box, Checkbox, Flex, Heading, IconButton, Image, Text} from "@chakra-ui/react";
import {validateCard} from "../../utils/validationFunctions";
import {ContextApi, DeckData, FieldProps} from "../../utils/types";
import {UserInput} from "./UserInput";
import {ChoosePhoto} from "../cards/ChoosePhoto";
import {MdDelete} from "react-icons/all";
import {ChooseContext} from "../cards/ChooseContext";
import {ContextBox} from "../cards/ContexBox";
import {ChoosePronunciation} from "../cards/ChoosePronunciation";

interface CardInputProps {
    photo: any | null;
    setPhoto: React.Dispatch<React.SetStateAction<any | null>>;
    context: ContextApi | null;
    setContext: React.Dispatch<React.SetStateAction<ContextApi | null>>;
    deck: DeckData;
}

export const CardInput: React.FC<CardInputProps> = (
    {
        photo,
        setPhoto,
        context,
        setContext,
        deck
    }
) => {
    const { values, isValid, setFieldValue } = useFormikContext<FormikValues>();

    return (
        <>
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
                    isDisabled={!isValid}
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
                                isDisabled={!isValid}
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
                            context?.from ? (
                                <ContextBox from={context.from} to={context.to} />
                            ) : null
                        }
                        <Checkbox
                            isDisabled={!(!!context && isValid)}
                            isChecked={values.includeNativeContext}
                            onChange={() => setFieldValue('includeNativeContext', !values.includeNativeContext)}
                        >
                            Include context in your native language?
                        </Checkbox>
                    </>
                )
            }

            <ChoosePronunciation isDisabled={true}/>
        </>
    );
}