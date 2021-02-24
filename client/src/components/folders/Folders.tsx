import React, {useContext} from "react";
import {
    Link as LinkPage,
} from 'react-router-dom';
import {Heading, Flex, IconButton, Stack, SimpleGrid} from "@chakra-ui/react";
import {CreateFolder} from "./CreateFolder";
import {DecksHomeProps} from "../decks/DecksHome";
import {CloseContextFolders, LanguageContext} from "../../App";
import {AddIcon} from "@chakra-ui/icons";
import {useSelector} from "react-redux";
import {foldersData} from "../../store/folderSlice";
import {NoDataBox} from "../NoDataBox";
import {FolderBox} from "./boxes/FolderBox";

export const Folders: React.FC<DecksHomeProps> = ({language, languageId}) => {
    const [languageLowercase] = useContext(LanguageContext);
    const [closeCreate, setCloseCreate] = useContext(CloseContextFolders);
    const closeCreateComponent = () => setCloseCreate(true);
    const openCreateComponent = () => setCloseCreate(false);

    const folderData = useSelector(foldersData);

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
                        <SimpleGrid columns={[2,2,3,3]} spacing={4} marginTop={4} marginBottom={4}>
                            {
                                folderData.map((folder, index) => (
                                    <LinkPage to={`/decks/${languageLowercase}/${languageId}/folders/review/${folder.folderId}`} key={index}>
                                        <FolderBox folder={folder} from="folders"/>
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