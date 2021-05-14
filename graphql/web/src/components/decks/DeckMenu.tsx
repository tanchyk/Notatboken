import React, { useRef } from "react";
import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { FaEllipsisV } from "react-icons/all";
import {
  AddIcon,
  AttachmentIcon,
  DeleteIcon,
  EditIcon,
} from "@chakra-ui/icons";
import { DeleteAlert } from "../../alerts/DeleteAlert";
import { DeckBoxProps } from "./DeckBox";
import NextLink from "next/link";

export const DeckMenu: React.FC<DeckBoxProps> = ({
  deck,
  language,
  languageId,
}) => {
  //Functions for confirmation page
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  // const dispatch = useDispatch<AppDispatch>();

  const deleteHandler = async () => {
    if (deck.deckId) {
      // await dispatch(deleteDeck({ deckId: deck.deckId }));
    }
    onClose();
  };

  return (
    <>
      <Menu>
        <MenuButton
          as={IconButton}
          variant="ghost"
          size="md"
          alignItems="center"
          icon={<FaEllipsisV />}
        />
        <MenuList>
          <NextLink
            href={`/${language}/${languageId}/add-to-folder/${deck.deckId}`}
          >
            <MenuItem icon={<AttachmentIcon />}>Save to folder</MenuItem>
          </NextLink>
          <NextLink href={`/${language}/${languageId}/add-card/${deck.deckId}`}>
            <MenuItem icon={<AddIcon />}>Add cards</MenuItem>
          </NextLink>
          <NextLink
            href={`/${language}/${languageId}/edit-deck/${deck.deckId}`}
          >
            <MenuItem icon={<EditIcon />}>Edit</MenuItem>
          </NextLink>
          <MenuItem icon={<DeleteIcon />} onClick={() => setIsOpen(true)}>
            Delete
          </MenuItem>
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
};
