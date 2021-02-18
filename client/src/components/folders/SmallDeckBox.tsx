import React, {useRef} from "react";
import {Flex, Stack, Heading, useStyleConfig, IconButton} from "@chakra-ui/react";
import {DeckData} from "../../utils/types";
import {DeckMenu} from "../decks/DeckMenu";
import {AlertForDelete} from "../AlertForDelete";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../store/store";
import {MdDelete} from "react-icons/all";
import {deleteDeckFromFolder} from "../../store/folderSlice";

interface SmallDeckBoxProps {
    deck: DeckData;
    folderId: number;
}

export const SmallDeckBox: React.FC<SmallDeckBoxProps> = ({deck, folderId}) => {
    const styleStack = useStyleConfig("Stack");
    styleStack.borderLeftWidth = "6px";

    //Delete deck
    const [isOpen, setIsOpen] = React.useState(false);
    const onClose = () => setIsOpen(false);
    const cancelRef = useRef<HTMLButtonElement>(null);

    const dispatch = useDispatch<AppDispatch>();

    const deleteHandler = async () => {
        if(deck.deckId) {
            await dispatch(deleteDeckFromFolder({folderId, deckId: deck.deckId}));
        }
        onClose();
    }

    return (
        <>
            <Flex
                sx={styleStack}
                padding={2}
                paddingLeft={5}
                justifyContent="space-between"
                alignItems="center"
                direction="row"
            >
                <Stack
                    spacing={3}
                    direction="row"
                >
                    <Heading size="md">{deck.deckName}</Heading>
                </Stack>
                <Stack
                    spacing={2}
                    direction="row"
                >
                    <DeckMenu deck={deck} />
                    <IconButton
                        aria-label="Delete Card"
                        size="md"
                        icon={<MdDelete/>}
                        onClick={() => setIsOpen(true)}
                    />
                </Stack>
            </Flex>

            <AlertForDelete
                header="Delete deck from folder"
                isOpen={isOpen}
                onClose={onClose}
                onClick={deleteHandler}
                cancelRef={cancelRef}
            />
        </>
    );
}