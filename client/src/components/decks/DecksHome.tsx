import React, {useContext, useEffect} from "react";
import {
    Box,
    Flex,
    Heading,
    Stack,
    SimpleGrid,
    IconButton
} from "@chakra-ui/react";
import {AddIcon} from "@chakra-ui/icons";
import {Languages} from "../../utils/types";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../../store/store";
import {decksData, clearDecks} from "../../store/deckSlice";
import {CreateDeck} from "./CreateDeck";
import {DeckBox} from "./boxes/DeckBox";
import {NoDataBox} from "../NoDataBox";
import {CloseContextHome} from "../../App";

export interface DecksHomeProps {
    language: Languages;
    languageId: number;
}

export const DecksHome: React.FC<DecksHomeProps> = ({language, languageId}) => {
    const [closeCreate, setCloseCreate] = useContext(CloseContextHome);
    const closeCreateComponent = () => setCloseCreate(true);
    const openCreateComponent = () => setCloseCreate(false);

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
                closeCreate ? null : (
                    <CreateDeck language={language} languageId={languageId} closeCreateComponent={closeCreateComponent}/>
                )
            }
            <Box>
                <Flex>
                    <Heading as="h1" size="lg">Decks</Heading>
                    {
                        closeCreate ? (
                            <IconButton  ml={3} aria-label="Close create deck" size="md" icon={<AddIcon/>} onClick={openCreateComponent}/>
                        ) : null
                    }
                </Flex>
                {
                    decks.length === 0 ? (
                        <NoDataBox type="decks" />
                    ) : (
                        <SimpleGrid columns={[1,1,2,2]} spacing={4} marginTop={4} marginBottom={4}>
                            {
                                decks.map((deck, key) => <DeckBox deck={deck} key={key}/>)
                            }
                        </SimpleGrid>
                    )
                }
            </Box>
        </Stack>
    );
}