import React, {useRef} from "react";
import {DeckData} from "../../utils/types";
import {
    Box,
    IconButton,
    Flex,
    Heading,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
    useStyleConfig
} from "@chakra-ui/react";
import {EditIcon, AddIcon, DeleteIcon, AttachmentIcon} from "@chakra-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {userData} from "../../store/userSlice";
import {AppDispatch} from "../../store/store";
import {deleteDeck} from "../../store/deckSlice";
import {FaEllipsisV} from "react-icons/all";

import {
    Link as LinkPage
} from 'react-router-dom';
import {AlertForDelete} from "../AlertForDelete";

interface DeckBoxProps {
    deck: DeckData;
}

export const DeckBox: React.FC<DeckBoxProps> = ({deck}) => {
    const styleStack = useStyleConfig("Stack");

    //Functions for confirmation page
    const [isOpen, setIsOpen] = React.useState(false);
    const onClose = () => setIsOpen(false);
    const cancelRef = useRef<HTMLButtonElement>(null);

    //Decks
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector(userData);

    const deleteHandler = async () => {
        if(deck.deckId) {
            await dispatch(deleteDeck({deckId: deck.deckId}))
        }
        onClose();
    }

    return (
        <>
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
                        {/*<Heading as="h1" fontSize="14px">{`${deck.cards.}`}</Heading>*/}
                    </Box>
                    <Flex justifyContent="space-between">
                        <Text fontSize="16px">{user.username}</Text>
                        <Menu>
                            <MenuButton
                                as={IconButton}
                                variant="ghost"
                                size="md"
                                alignItems="center"
                                icon={<FaEllipsisV />}
                            />
                            <MenuList>
                                <MenuItem icon={<AttachmentIcon />}>Save to folder</MenuItem>
                                <LinkPage to={`/decks/${deck.language?.languageName}/add-card/${deck.deckId}`}>
                                    <MenuItem icon={<AddIcon />}>Add cards</MenuItem>
                                </LinkPage>
                                <LinkPage to={`/decks/${deck.language?.languageName}/edit-deck/${deck.deckId}`}>
                                    <MenuItem icon={<EditIcon/>}>Edit</MenuItem>
                                </LinkPage>
                                <MenuItem icon={<DeleteIcon />} onClick={() => setIsOpen(true)}>Delete</MenuItem>
                            </MenuList>
                        </Menu>
                    </Flex>
                </Flex>
            </Box>

            <AlertForDelete
                header={`Delete Deck ${deck.deckName}`}
                isOpen={isOpen}
                onClose={onClose}
                onClick={deleteHandler}
                cancelRef={cancelRef}
            />
        </>
    );
}