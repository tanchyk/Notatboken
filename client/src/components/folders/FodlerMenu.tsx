import React, {useContext, useRef} from "react";
import {
    Link as LinkPage
} from 'react-router-dom';
import {IconButton, Menu, MenuButton, MenuItem, MenuList} from "@chakra-ui/react";
import {FaEllipsisV} from "react-icons/all";
import {DeleteIcon, EditIcon} from "@chakra-ui/icons";
import {FolderData} from "../../utils/types";
import {DeleteAlert} from "../DeleteAlert";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../store/store";
import {deleteFolder} from "../../store/folderSlice";
import {LanguageContext} from "../../App";

interface FolderMenuProps {
    folder: FolderData;
}

export const FolderMenu: React.FC<FolderMenuProps> = ({folder}) => {
    const [language] = useContext(LanguageContext);

    //Functions for confirmation page
    const [isOpen, setIsOpen] = React.useState(false);
    const onClose = () => setIsOpen(false);
    const cancelRef = useRef<HTMLButtonElement>(null);

    //Redux
    const dispatch = useDispatch<AppDispatch>();

    const deleteHandler = async () => {
        if(folder.folderId) {
            await dispatch(deleteFolder({folderId: folder.folderId}))
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
                    <LinkPage to={`/decks/${language}/${folder.language?.languageId}/edit-folder/${folder.folderId}`}>
                        <MenuItem icon={<EditIcon/>}>Edit</MenuItem>
                    </LinkPage>
                    <MenuItem icon={<DeleteIcon/>} onClick={() => setIsOpen(true)}>Delete</MenuItem>
                </MenuList>
            </Menu>

            <DeleteAlert
                header={`Delete Folder ${folder.folderName}`}
                isOpen={isOpen}
                onClose={onClose}
                onClick={deleteHandler}
                cancelRef={cancelRef}
            />
        </>
    );
}