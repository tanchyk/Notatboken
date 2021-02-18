import React from "react";
import {DeckData} from "../../../utils/types";
import {
    Box,
    Flex,
    Heading,
    Text,
    useStyleConfig
} from "@chakra-ui/react";
import {useSelector} from "react-redux";
import {userData} from "../../../store/userSlice";

import {
    Link as LinkPage
} from 'react-router-dom';
import {DeckMenu} from "../DeckMenu";

interface DeckBoxProps {
    deck: DeckData;
}

export const DeckBox: React.FC<DeckBoxProps> = ({deck}) => {
    const styleStack = useStyleConfig("Stack");

    const user = useSelector(userData);

    return (
        <LinkPage to={`/decks/${deck.language!.languageName}/review/${deck.deckId}`}>
            <Box
                sx={styleStack}
                h="150px"
                padding={5}
                paddingTop={7}
                _hover={{
                    paddingBottom: "11.5px",
                    borderBottomWidth: "6px"
                }}
            >
                <Flex direction="column" justifyContent="space-between" h="100%">
                    <Box>
                        <Heading as="h1" fontSize="21px">{deck.deckName}</Heading>
                    </Box>
                    <Flex justifyContent="space-between">
                        <Text fontSize="16px">{user.username}</Text>
                        <Box onClick={(event: React.MouseEvent) => event.preventDefault()}>
                            <DeckMenu deck={deck} />
                        </Box>
                    </Flex>
                </Flex>
            </Box>
        </LinkPage>
    );
}