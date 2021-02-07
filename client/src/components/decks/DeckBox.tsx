import React, {useRef} from "react";
import {DeckData} from "../../utils/types";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent, AlertDialogFooter, AlertDialogHeader,
    AlertDialogOverlay,
    Box,
    IconButton,
    Button,
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
                                <MenuItem icon={<AddIcon />}>Add cards</MenuItem>
                                <MenuItem icon={<EditIcon />}>Edit</MenuItem>
                                <MenuItem icon={<DeleteIcon />} onClick={() => setIsOpen(true)}>Delete</MenuItem>
                            </MenuList>
                        </Menu>
                    </Flex>
                </Flex>
            </Box>

            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="xl" fontWeight="bold">
                            {`Delete Deck ${deck.deckName}`}
                        </AlertDialogHeader>

                        <AlertDialogBody fontSize="lg">
                            Are you sure? You can't undo this action afterwards.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button
                                ref={cancelRef}
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                colorScheme="red"
                                onClick={deleteHandler}
                                ml={3}
                            >
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
}