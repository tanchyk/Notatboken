import React, {useContext, useRef} from "react";
import {IconButton, Menu, MenuButton, MenuItem, MenuList} from "@chakra-ui/react";
import {FaEllipsisV} from "react-icons/all";
import {AddIcon, AttachmentIcon, DeleteIcon, EditIcon} from "@chakra-ui/icons";
import {Link as LinkPage} from "react-router-dom";
import {DeckData} from "../../utils/types";
import {DeleteAlert} from "../DeleteAlert";
import {deleteDeck} from "../../store/deckSlice";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../store/store";
import {LanguageContext} from "../../App";

interface DeckMenuProps {
    deck: DeckData;
}

export const DeckMenu: React.FC<DeckMenuProps> = ({deck}) => {
    const [language] = useContext(LanguageContext);

    //Functions for confirmation page
    const [isOpen, setIsOpen] = React.useState(false);
    const onClose = () => setIsOpen(false);
    const cancelRef = useRef<HTMLButtonElement>(null);

    //Redux
    const dispatch = useDispatch<AppDispatch>();

    const deleteHandler = async () => {
        if(deck.deckId) {
            await dispatch(deleteDeck({deckId: deck.deckId}))
        }
        onClose();
    }

    return (
        <>
            <Menu>
                <MenuButton
                    as={IconButton}
                    variant="ghost"
                    size="md"
                    alignItems="center"
                    icon={<FaEllipsisV/>}
                />
                <MenuList>
                    <LinkPage to={`/decks/${language}/add-to-folder/${deck.deckId}`}>
                        <MenuItem icon={<AttachmentIcon/>}>Save to folder</MenuItem>
                    </LinkPage>
                    <LinkPage to={`/decks/${language}/add-card/${deck.deckId}`}>
                        <MenuItem icon={<AddIcon/>}>Add cards</MenuItem>
                    </LinkPage>
                    <LinkPage to={`/decks/${language}/edit-deck/${deck.deckId}`}>
                        <MenuItem icon={<EditIcon/>}>Edit</MenuItem>
                    </LinkPage>
                    <MenuItem icon={<DeleteIcon/>} onClick={() => setIsOpen(true)}>Delete</MenuItem>
                </MenuList>
            </Menu>

            <DeleteAlert
                header={`Delete Deck ${deck.deckName}`}
                isOpen={isOpen}
                onClose={onClose}
                onClick={deleteHandler}
                cancelRef={cancelRef}
            />
        </>
    );
}