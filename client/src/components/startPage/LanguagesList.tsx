import React, {ChangeEvent, useState} from "react";
import {Box, Button, Flex, Heading, Image, Select, Stack, Text, useStyleConfig, useToast} from "@chakra-ui/react";
import {ChevronRightIcon} from "@chakra-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {csrfData} from "../../store/csrfSlice";
import {Languages} from "../../utils/types";
import {flags} from "../../utils/theme";
import {Link as LinkPage} from "react-router-dom";
import {loadUser, userData} from "../../store/userSlice";
import {AppDispatch} from "../../store/store";

export const LanguagesList: React.FC = () => {
    const styleStack = useStyleConfig("Stack");
    const toast = useToast();

    const [addLanguage, setAddLanguage] = useState<Languages>('Norwegian');

    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector(userData);
    const csrfToken = useSelector(csrfData);

    const changeHandler = (event: ChangeEvent<HTMLSelectElement>) => {
        setAddLanguage(event.target.value as Languages);
    }

    const addHandler = async () => {
        const response = await fetch('/api/languages/add-language', {
            method: 'POST',
            body: JSON.stringify({
                language: addLanguage
            }),
            headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': `${csrfToken}`
            }
        });

        const result = await response.json();
        if (result.message === 'Language is added') {
            toast({
                title: "Language Added.",
                description: "We've added the language for you.",
                status: "success",
                duration: 9000,
                isClosable: true,
            })
            dispatch(loadUser());
        } else {
            toast({
                title: "Language is not Added.",
                description: result.message,
                status: "error",
                duration: 9000,
                isClosable: true
            })
        }
    }

    return (
        <Box flexDirection="column" w="70%">
            <Heading as="h1" fontSize="22px" marginTop={8}>Languages 🎓</Heading>
            <Box
                sx={styleStack}
                marginRight={0}
                padding={9}
                marginTop={5}
                spacing={5}
            >
                <Flex direction="row" spacing={4} justifyContent="space-between">
                    <Box w="78%">
                        <Heading as="h1" size="md">Your Languages to study</Heading>
                        <Stack
                            spacing={2}
                            marginTop={5}
                            marginBottom={5}
                            marginLeft={5}
                        >
                            {
                                user.languages?.map((language, index) => (
                                        <LinkPage to={`/decks/${language.languageName.toLowerCase()}`} key={index}>
                                            <Button
                                                w="100%"
                                                variant="ghost"
                                                justifyContent="left"
                                                flexDirection="row"
                                                rightIcon={<ChevronRightIcon/>}
                                            >
                                                <Image w="28px" src={flags[language.languageName.toLowerCase() as keyof typeof flags]}/>
                                                <Text fontSize="lg" ml={2}>{language.languageName}</Text>
                                            </Button>
                                        </LinkPage>
                                    )
                                )
                            }
                        </Stack>
                        <Select variant="filled" size="md" onChange={changeHandler}>
                            <option value="Norwegian">Norwegian</option>
                            <option value="German">German</option>
                            <option value="Polish">Polish</option>
                            <option value="Russian">Russian</option>
                            <option value="French">French</option>
                            <option value="Spanish">Spanish</option>
                        </Select>
                    </Box>
                    <Button
                        width="140px"
                        type="submit"
                        onClick={addHandler}
                        marginTop="auto"
                    >
                        Add Language
                    </Button>
                </Flex>
            </Box>
        </Box>
    );
}