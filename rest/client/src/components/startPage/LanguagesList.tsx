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
import {LanguagesHeader} from "./LanguagesHeader";
import {ppdRequest} from "../../store/requestFunction";

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
        let response: any;
        if(csrfToken) {
            response = await ppdRequest(csrfToken, {
                language: addLanguage
            }, '/languages/add-language', 'POST');

        }

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
                    user.languages?.map((language, index) => (
                            <LinkPage to={`/decks/${language.languageName.toLowerCase()}`} key={index}>
                                <Button
                                    w="100%"
                                    size="lg"
                                    variant="outline"
                                    justifyContent="space-between"
                                    rightIcon={<ChevronRightIcon/>}
                                >
                                    <Flex alignItems="center">
                                        <Image w="28px" src={flags[language.languageName.toLowerCase() as keyof typeof flags]}/>
                                        <Text fontSize="lg" ml={6}>{language.languageName}</Text>
                                    </Flex>
                                </Button>
                            </LinkPage>
                        )
                    )
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
                        onClick={addHandler}
                    >
                        Add Language
                    </Button>
                </Flex>
            </Stack>
        </Box>
    );
}