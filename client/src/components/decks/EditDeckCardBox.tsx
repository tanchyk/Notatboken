import React, {useRef} from "react";
import {Divider, Flex, IconButton, Stack, Text, useStyleConfig} from "@chakra-ui/react";
import {EditIcon} from "@chakra-ui/icons";
import {MdDelete} from "react-icons/all";
import {CardData} from "../../utils/types";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../store/store";
import {deleteCard} from "../../store/cardSlice";
import {AlertForDelete} from "../AlertForDelete";
import {AlertForCardChange} from "../cards/AlertForCardChange";

interface EditDeckCardBoxProps {
    card: CardData;
}

export const EditDeckCardBox: React.FC<EditDeckCardBoxProps> = ({card}) => {
    const styleStack = useStyleConfig("Stack");
    styleStack.borderLeftWidth = "6px";

    //Delete card
    const [isOpen, setIsOpen] = React.useState(false);
    const onClose = () => setIsOpen(false);
    const cancelRef = useRef<HTMLButtonElement>(null);

    //Edit card
    const [isOpenEdit, setIsOpenEdit] = React.useState(false);
    const onCloseEdit = () => setIsOpenEdit(false);
    const cancelRefEdit = useRef<HTMLButtonElement>(null);

    const dispatch = useDispatch<AppDispatch>();

    const deleteHandler = async () => {
        if(card.cardId) {
            await dispatch(deleteCard({cardId: card.cardId}))
        }
        onClose();
    }

    return (
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
                <IconButton
                    aria-label="Edit Card"
                    size="sm"
                    icon={<EditIcon/>}
                    onClick={() => setIsOpenEdit(true)}
                />
                <IconButton
                    aria-label="Delete Card"
                    size="sm"
                    icon={<MdDelete/>}
                    onClick={() => setIsOpen(true)}
                />
            </Stack>

            <AlertForCardChange
                card={card}
                isOpen={isOpenEdit}
                onClose={onCloseEdit}
                cancelRef={cancelRefEdit}
            />

            <AlertForDelete
                header="Delete Card"
                isOpen={isOpen}
                onClose={onClose}
                onClick={deleteHandler}
                cancelRef={cancelRef}
            />
        </Flex>
    );
}