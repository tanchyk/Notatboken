import React, {useContext, useEffect} from "react";
import {
    Link as LinkPage,
} from 'react-router-dom';
import {Heading, Flex, IconButton, Stack, SimpleGrid} from "@chakra-ui/react";
import {CreateFolder} from "./CreateFolder";
import {DecksHomeProps} from "../decks/DecksHome";
import {CloseContextFolders, LanguageContext} from "../../App";
import {AddIcon} from "@chakra-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../../store/store";
import {fetchFolder, foldersData, foldersStatus, clearFolders} from "../../store/folderSlice";
import {NoDataBox} from "../NoDataBox";
import {FolderBox} from "./boxes/FolderBox";
import {Languages} from "../../utils/types";

export interface FoldersProps extends DecksHomeProps {
    language: Languages;
    languageId: number;
}

export const Folders: React.FC<FoldersProps> = ({language, languageId}) => {
    const [languageLowercase] = useContext(LanguageContext);
    const [closeCreate, setCloseCreate] = useContext(CloseContextFolders);
    const closeCreateComponent = () => setCloseCreate(true);
    const openCreateComponent = () => setCloseCreate(false);

    const dispatch = useDispatch<AppDispatch>();
    const folderData = useSelector(foldersData);
    const folderStatus = useSelector(foldersStatus);

    useEffect(() => {
        if(folderData[0]?.language?.languageId !== languageId) {
            dispatch(clearFolders());
        }
    }, [])

    useEffect(() => {
        if(folderStatus === 'idle') {
            dispatch(fetchFolder({languageId}))
        }
    }, [folderStatus])

    return (
        <Stack
            marginTop={8}
            spacing={6}
        >
            {
                closeCreate ? null : (
                    <CreateFolder language={language} languageId={languageId} closeCreateComponent={closeCreateComponent}/>
                )
            }
            <Flex>
                <Heading as="h1" size="lg">Folders</Heading>
                {
                    closeCreate ? (
                        <IconButton  ml={3} aria-label="Close create deck" size="md" icon={<AddIcon/>} onClick={openCreateComponent}/>
                    ) : null
                }
            </Flex>
                {
                    folderData.length === 0 ? <NoDataBox type="folders"/> : (
                        <SimpleGrid columns={3} spacing={4} marginTop={4} marginBottom={4}>
                            {
                                folderData.map((folder, index) => (
                                    <LinkPage to={`/decks/${languageLowercase}/${folder.language?.languageId}/folders/review/${folder.folderId}`}>
                                        <FolderBox folder={folder} from="folders" key={index}/>
                                    </LinkPage>
                                    )
                                )
                            }
                        </SimpleGrid>
                    )
                }
        </Stack>
    );
}