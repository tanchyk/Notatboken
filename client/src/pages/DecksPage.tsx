import React, {useState} from "react";
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
    Button
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

interface DecksProps {
    match: match<{language: string}>
}

const DecksPage: React.FC<DecksProps> = ({match}) => {
    const styleStack = useStyleConfig("Stack");
    const language = match.params.language.charAt(0).toUpperCase() + match.params.language.slice(1);

    const [createClose, setCreateClose] = useState<boolean>(false);

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
                            createClose ? null : (
                                <Box
                                    sx={styleStack}
                                    padding={9}
                                    spacing={5}
                                >
                                    <Flex direction="row" justifyContent="space-between">
                                        <Box boxSize="150px">
                                            <Image src="https://i.pinimg.com/564x/1d/fd/b3/1dfdb395848d105618ebc0b87b1b96b7.jpg" />
                                        </Box>
                                        <Box w="60%">
                                            <Heading size="lg">{`Create a study deck for the ${language} language`}</Heading>
                                            <Button
                                                width="140px"
                                                size="lg"
                                                type="submit"
                                                // onClick={addHandler}
                                                marginTop={5}
                                            >
                                                Create Deck
                                            </Button>
                                        </Box>
                                        <CloseButton onClick={() => setCreateClose(true) }/>
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
        </>
    );
}

export default DecksPage;