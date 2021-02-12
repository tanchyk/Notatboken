import React, {useEffect, useState} from "react";
import {
    Box,
    Flex,
    Heading,
    Stack,
    Text,
    SimpleGrid,
    useStyleConfig,
    IconButton
} from "@chakra-ui/react";
import {AddIcon} from "@chakra-ui/icons";
import {Languages} from "../../utils/types";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../../store/store";
import {decksData, clearDecks} from "../../store/deckSlice";
import {DecksCreate} from "./DecksCreate";
import {DeckBox} from "./DeckBox";

export interface DecksHomeProps {
    language: Languages;
    languageId: number;
}

export const DecksHome: React.FC<DecksHomeProps> = ({language, languageId}) => {
    const styleStack = useStyleConfig("Stack");

    const [createClose, setCreateClose] = useState<boolean>(false);
    const closeCreateComponent = () => setCreateClose(true);
    const openCreateComponent = () => setCreateClose(false);

    //Load Decks
    const dispatch = useDispatch<AppDispatch>();

    const decks = useSelector(decksData);

    useEffect(() => {
        if(decks.length > 0 && decks[0]?.language?.languageId !== languageId) {
            dispatch(clearDecks());
        }
    }, [])

    return (
        <Stack
            marginTop={8}
            spacing={8}
        >
            {
                createClose ? null : (
                    <DecksCreate language={language} languageId={languageId} closeCreateComponent={closeCreateComponent}/>
                )
            }
            <Box>
                <Flex>
                    <Heading as="h1" size="lg">Decks</Heading>
                    {
                        createClose ? (
                            <IconButton  ml={3} aria-label="Close create deck" size="md" icon={<AddIcon/>} onClick={openCreateComponent}/>
                        ) : null
                    }
                </Flex>
                {
                    decks.length === 0 ? (
                        <Box
                            sx={styleStack}
                            h="150px"
                            mt={5}
                            padding={10}
                            spacing={5}
                        >
                            <Flex alignItems="center" direction="column">
                                <Heading as="h1" size="lg">You have no decks yet</Heading>
                                <Text fontSize="lg" mt={2}>Decks you create or study will be displayed here.</Text>
                            </Flex>
                        </Box>
                    ) : (
                        <SimpleGrid columns={2} spacing={4} marginTop={4} marginBottom={4}>
                            {
                                decks.map((deck, key) => {
                                    return (
                                        <DeckBox deck={deck} key={key}/>
                                    );
                                })
                            }
                        </SimpleGrid>
                    )
                }
            </Box>
        </Stack>
    );
}