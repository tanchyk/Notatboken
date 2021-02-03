import React, {useEffect, useRef, useState} from "react";
import {
    match
} from 'react-router-dom';
import {Wrapper} from "../components/wrappers/Wrapper";
import {
    Stack,
    Box,
    Flex,
    Heading,
    Image,
    Text,
    CloseButton,
    useStyleConfig,
    Button,
    Input,
    AlertDialogOverlay, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, AlertDialog, AlertDialogContent,
    FormControl, FormLabel
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import {history} from '../App';
import {useSelector} from "react-redux";
import {userData} from "../store/userSlice";

interface DecksProps {
    match: match<{language: string}>
}

const DecksPage: React.FC<DecksProps> = ({match}) => {
    const styleStack = useStyleConfig("Stack");
    const language = match.params.language.charAt(0).toUpperCase() + match.params.language.slice(1);

    const [isOpen, setIsOpen] = useState(false);
    const onClose = () => setIsOpen(false);
    const cancelRef = useRef<HTMLButtonElement>(null);

    const [createClose, setCreateClose] = useState<boolean>(false);

    const user = useSelector(userData);

    useEffect(() => {
        let check = false;
        user.languages?.forEach(languageUser => {
            if(languageUser.languageName === language) {
                check = true;
            }
        });
        if(!check) {
            history.push('/error')
        }
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
                    <Heading color="white" fontSize="38px">{language}</Heading>
                    <Text color="white">here you will se stats</Text>
                </Wrapper>
            </Flex>
            <Flex justifyContent="center">
                <Wrapper variant="regular">
                    <Box
                        sx={styleStack}
                        w="27%"
                        marginRight={0}
                        padding={9}
                        marginTop={8}
                        spacing={5}
                    >
                    </Box>
                    <Stack
                        w="70%"
                        marginTop={8}
                        spacing={8}
                    >
                        {
                            createClose? null : (
                                <Box
                                    sx={styleStack}
                                    padding={9}
                                    spacing={5}
                                >
                                    <Flex direction="row" justifyContent="space-between">
                                        <Box boxSize="150px">
                                            <Image
                                                src="https://lh3.googleusercontent.com/Pw712TgyLqjyCoE9ljuyegTZ1XHapQI6RvrsEn5SqgZshSpIZheLPJlPcP_HtGWgQ-ss6HtzPLWeYqsNC8U-mLCoM6wxwB3_sCdbMBxioHdfQ4mhV2pT86MdV8rfXjgGlsBxINP_i32Y7Ah17WhFEi9n69AvW_sIiumxg5XTMGIAacBqHGWniR7rnNT1aNQkJLABeCgoMGSRhAS6ys0Z_NSsi2y-Z7tAd8ET_Qspf1fHW6RBWu-2cCVfEEqeHc2G99nd-27rFkf0CZErmnQTfbHMJOwflWPc72pEuANi2sSb6Rp-Kvt-cJuBWBuEPmXfI2TYuDw2i5Tn-Fuq4CSbJvDppQzznXV3mi6mKQbKNuKSfMmiMVN9wBUlXPteFACDVgVbL121FgWdCN2DsyEkW2gFwlVePfhNJN65vXhV5yoay3qPuy8hLbGk7ddzwYpoiu-F96dWtWT3MZmCLtneOzI6_YuWiAVxnZSZ4IMGoXLCN9UiYRkuBkIHfp81rPzHvSTb7_DTSdpmobXtn59AINe1sJVGN5dcsW4NjJ30IKHAetklY_HDOxw-DoFvW7HU5iwfHq2z5PF1G81bFv8LuMD5V17BQrgVu0sUi_t9sT-ejOAqu_hZ2SFlHhXLYlJ-X6ZuoLKAwkg7oQfBeMreuERvjWmqglyNyCI0zc8hXJ1fJhlFcjgAHn1hQWXu=w423-h411-no?authuser=0"/>
                                        </Box>
                                        <Box w="60%">
                                            <Heading size="lg">{`Create a study deck for the ${language} language`}</Heading>
                                            <Button
                                                width="140px"
                                                size="lg"
                                                type="submit"
                                                onClick={() => setIsOpen(true)}
                                                marginTop={5}
                                            >
                                                Create Deck
                                            </Button>
                                        </Box>
                                        <CloseButton onClick={() => setCreateClose(true)}/>
                                    </Flex>
                                </Box>
                            )
                        }
                        <Box>
                            <Flex>
                                <Heading as="h1" size="lg">Decks</Heading>
                                {
                                    createClose ? (
                                        <Button
                                            variant="outline"
                                            ml={3}
                                            w="32px"
                                            _hover={{backgroundColor: "rgb(239, 239, 239)"}}
                                            onClick={() => setCreateClose(false) }
                                        >
                                            <AddIcon />
                                        </Button>
                                    ) : null
                                }
                            </Flex>
                            <Box
                                sx={styleStack}
                                mt={5}
                                padding={10}
                                spacing={5}
                            >
                                <Flex alignItems="center" direction="column">
                                    <Heading as="h1" size="lg">You have no decks yet</Heading>
                                    <Text fontSize="lg" mt={2}>Decks you create or study will be displayed here.</Text>
                                </Flex>
                            </Box>
                        </Box>
                    </Stack>
                </Wrapper>
            </Flex>

            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader backgroundColor="blue.50" borderTopRadius="lg">
                            <Heading as="h1" size="lg">
                                Create Deck
                            </Heading>
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            <FormControl id="first-name" isRequired>
                                <FormLabel fontSize="xl">Deck name</FormLabel>
                                <Input variant="outline" placeholder="Please, enter name of the deck" size="lg" />
                            </FormControl>
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button variant="outline" ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button onClick={onClose} ml={3}>
                                Create
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
}

export default DecksPage;