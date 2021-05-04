import React, {ChangeEvent, useState} from "react";
import {Box, Button, Flex, Heading, Image, Select, Stack, Text, useStyleConfig, useToast} from "@chakra-ui/react";
import {ChevronRightIcon} from "@chakra-ui/icons";
import {flags} from "../../utils/theme";
import {Languages} from "../../utils/types";
import {LanguagesHeader} from "./LanguagesHeader";
import {Language, useAddLanguageMutation, useMeQuery} from "../../generated/graphql";
import NextLink from "next/link";
import {gql} from "@apollo/client/core";

export const LanguagesList: React.FC = () => {
    const styleStack = useStyleConfig("Stack");
    const toast = useToast();

    const [addedLanguage, setAddedLanguage] = useState<Languages>('Norwegian');

    const {data} = useMeQuery();
    const [addLanguage, {loading}] = useAddLanguageMutation();

    const changeHandler = (event: ChangeEvent<HTMLSelectElement>) => {
        setAddedLanguage(event.target.value as Languages);
    }

    const addHandler = async (addedLanguage: Languages) => {
        const response = await addLanguage({
            variables: {
                language: addedLanguage
            },
            update: (
                cache,
                {data: addData}
            ) => {
                if (addData?.addLanguage.languageId !== 0) {
                    cache.writeFragment({
                        id: "User:" + data?.me?.id,
                        fragment: gql(`
                            fragment _ on User {
                                id
                                userLanguages
                            }
                        `),
                        data: {
                            userLanguages: data?.me?.userLanguages.concat({
                                languageId: addData?.addLanguage.languageId,
                                languageName: addedLanguage
                            } as Language)
                        }
                    });
                }
            }
        })

        if (response.data?.addLanguage.languageId !== 0) {
            toast({
                title: "Language Added.",
                description: "We've added the language for you.",
                status: "success",
                duration: 9000,
                isClosable: true,
            });
            return;
        }
        if (response.data?.addLanguage.errors) {
            toast({
                title: "Language is not Added.",
                description: response.data?.addLanguage.errors[0].message,
                status: "error",
                duration: 9000,
                isClosable: true
            })
        }
    }

    return (
        <Box flexDirection="column">
            <Heading as="h1" fontSize="22px" marginTop={8}>Languages</Heading>
            <Stack
                sx={styleStack}
                marginRight={0}
                padding={9}
                marginTop={5}
                spacing={4}
            >
                <LanguagesHeader/>
                {
                    data?.me?.userLanguages ?
                        data.me.userLanguages.map((language, index) => (
                                <NextLink href={`/decks/${language.languageName.toLowerCase()}`} key={index}>
                                    <Button
                                        w="100%"
                                        size="lg"
                                        variant="outline"
                                        justifyContent="space-between"
                                        rightIcon={<ChevronRightIcon/>}
                                    >
                                        <Flex alignItems="center">
                                            <Image w="28px"
                                                   src={flags[language.languageName.toLowerCase() as keyof typeof flags]}/>
                                            <Text fontSize="lg" ml={6}>{language.languageName}</Text>
                                        </Flex>
                                    </Button>
                                </NextLink>
                            )
                        ) : null
                }
                <Flex justifyContent="space-between">
                    <Select variant="filled" size="lg" onChange={changeHandler}>
                        <option value="Norwegian">Norwegian</option>
                        <option value="German">German</option>
                        <option value="Polish">Polish</option>
                        <option value="Russian">Russian</option>
                        <option value="French">French</option>
                        <option value="Spanish">Spanish</option>
                    </Select>
                    <Button
                        minW="140px"
                        ml={3}
                        size="lg"
                        type="submit"
                        onClick={() => addHandler(addedLanguage)}
                        isLoading={loading}
                    >
                        Add Language
                    </Button>
                </Flex>
            </Stack>
        </Box>
    );
}