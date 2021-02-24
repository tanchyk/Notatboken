import React, {useRef} from "react";
import {Link as LinkPage} from "react-router-dom";
import {Divider, Flex, IconButton, Stack, Text, useStyleConfig} from "@chakra-ui/react";
import {EditIcon} from "@chakra-ui/icons";
import {MdDelete} from "react-icons/all";
import {CardData, DeckData} from "../../../utils/types";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../../store/store";
import {deleteCard} from "../../../store/cardSlice";
import {AlertForDelete} from "../../AlertForDelete";
import {decreaseCardAmount} from "../../../store/deckSlice";

interface EditDeckCardBoxProps {
    card: CardData;
    deck: DeckData;
}

export const SmallCardBox: React.FC<EditDeckCardBoxProps> = ({card, deck}) => {
    const styleStack = useStyleConfig("Stack");
    styleStack.borderLeftWidth = "6px";

    //Delete card
    const [isOpen, setIsOpen] = React.useState(false);
    const onClose = () => setIsOpen(false);
    const cancelRef = useRef<HTMLButtonElement>(null);

    const dispatch = useDispatch<AppDispatch>();

    const deleteHandler = async () => {
        if(card.cardId && deck.deckId) {
            await dispatch(deleteCard({cardId: card.cardId}))
            await dispatch(decreaseCardAmount(deck.deckId));
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
                direction="row"
            >
                <Stack
                    spacing={3}
                    direction="row"
                >
                    <Text fontSize="lg">{card.foreignWord}</Text>
                    <Divider orientation="vertical" h="24.8px"/>
                    <Text fontSize="lg">{card.nativeWord}</Text>
                </Stack>
                <Stack
                    spacing={2}
                    direction="row"
                >
                    <LinkPage to={`/decks/${deck.language?.languageName}/edit-card/${deck.deckId}/${card.cardId}`}>
                        <IconButton
                            aria-label="Edit Card"
                            size="sm"
                            icon={<EditIcon/>}
                        />
                    </LinkPage>
                    <IconButton
                        aria-label="Delete Card"
                        size="sm"
                        icon={<MdDelete/>}
                        onClick={() => setIsOpen(true)}
                    />
                </Stack>
            </Flex>

            <AlertForDelete
                header="Delete Card"
                isOpen={isOpen}
                onClose={onClose}
                onClick={deleteHandler}
                cancelRef={cancelRef}
            />
        </>
    );
}