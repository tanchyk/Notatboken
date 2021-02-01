import React, {ChangeEvent, useEffect, useState} from "react";
import {Flex, Heading, Stack, Text, Select, useStyleConfig, Button, useToast, Box, Image} from "@chakra-ui/react";
import {Wrapper} from "../components/wrappers/Wrapper";
import {useSelector} from "react-redux";
import {userData} from "../store/userSlice";
import {Languages} from "../utils/types";
import {csrfData} from "../store/csrfSlice";

import {ChevronRightIcon} from '@chakra-ui/icons';

const flags = {
    german: 'https://cdn.countryflags.com/thumbs/germany/flag-waving-250.png',
    english: 'https://cdn.countryflags.com/thumbs/united-kingdom/flag-waving-250.png',
    norwegian: 'https://cdn.countryflags.com/thumbs/norway/flag-waving-250.png',
    russian: 'https://cdn.countryflags.com/thumbs/russia/flag-waving-250.png',
    spanish: 'https://cdn.countryflags.com/thumbs/spain/flag-waving-250.png',
    french: 'https://cdn.countryflags.com/thumbs/france/flag-waving-250.png'
}

const StartPage: React.FC = () => {
    const styleStack = useStyleConfig("Stack");
    const toast = useToast();

    const [addLanguage, setAddLanguage] = useState<Languages>('English');
    const [languages, setLanguages] = useState<Array<any> | null>(null)

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

    const findLanguages = async () => {
        const response = await fetch('/api/languages/language', {
            method: 'GET'
        });
        setLanguages((await response.json()).languages);
    }

    useEffect(() => {
        findLanguages();
    }, [])

    return (
        <>
            <Flex
                justifyContent="center"
                backgroundColor="cyan.600"
                paddingTop={10}
                paddingBottom={10}
            >
                <Wrapper variant="regular">
                    <Heading color="white" fontSize="38px">{user.name ? user.name : user.username}</Heading>
                    <Text color="white">here you will se stats</Text>
                </Wrapper>
            </Flex>
            <Flex justifyContent="center">
                <Wrapper variant="regular" direction="column">
                    <Heading as="h1" fontSize="22px" marginTop={8}>Languages 🎓</Heading>
                    <Box
                        sx={styleStack}
                        w="70%"
                        marginRight={0}
                        padding={9}
                        marginTop={5}
                        spacing={5}
                    >
                        <Flex direction="row" spacing={4} justifyContent="space-between">
                            <Box w="100%">
                                <Heading as="h1" size="md">Your Languages</Heading>
                                <Stack spacing={2} margin={5}>
                                    {
                                        languages?.map((language, index) => {
                                            // @ts-ignore
                                            const src = flags[language.languageName.toLowerCase()];
                                            console.log(src)
                                            return (
                                                <Button
                                                    variant="ghost"
                                                    justifyContent="left"
                                                    paddingTop={2}
                                                    key={index}
                                                    rightIcon={<ChevronRightIcon/>}
                                                >
                                                    <Flex direction="row">
                                                        <Box boxSize="28px" alignItems="center">
                                                            <Image src={src}/>
                                                        </Box>
                                                        <Text fontSize="lg" ml={2}>{language.languageName}</Text>
                                                    </Flex>
                                                </Button>
                                            )
                                        })
                                    }
                                </Stack>
                                <Select variant="filled" size="lg" onChange={changeHandler}>
                                    <option value="English">English</option>
                                    <option value="German">German</option>
                                    <option value="Norwegian">Norwegian</option>
                                    <option value="Russian">Russian</option>
                                    <option value="French">French</option>
                                    <option value="Spanish">Spanish</option>
                                </Select>
                            </Box>
                            <Flex direction="column" alignItems="end">
                                <Button
                                    width="140px"
                                    type="submit"
                                    h="42px"
                                    onClick={addHandler}
                                    top="100%"
                                >
                                    Add Language
                                </Button>
                            </Flex>
                        </Flex>
                    </Box>
                </Wrapper>
            </Flex>
        </>
    );
}

export default StartPage;