import React, {useContext} from "react";
import {
    Link as LinkPage,
} from 'react-router-dom';
import {Heading, Flex,Stack, IconButton, SimpleGrid, Divider, Box, useStyleConfig, Skeleton} from "@chakra-ui/react";
import {DecksHomeProps} from "../decks/Decks";
import {CloseContextFolders, LanguageContext} from "../../App";
import {AddIcon} from "@chakra-ui/icons";
import {useSelector} from "react-redux";
import {foldersData, foldersStatus} from "../../store/folderSlice";
import {NoDataBox} from "../NoDataBox";
import {FolderBox} from "./boxes/FolderBox";
import {AppWrapper} from "../wrappers/AppWrapper";
import {CreateForm} from "../CreateForm";

export const Folders: React.FC<DecksHomeProps> = ({language, languageId}) => {
    const styleProgress = useStyleConfig("Progress");

    const [languageLowercase] = useContext(LanguageContext);
    const [closeCreate, setCloseCreate] = useContext(CloseContextFolders);
    const closeCreateComponent = () => setCloseCreate(true);
    const openCreateComponent = () => setCloseCreate(false);

    const folderData = useSelector(foldersData);
    const folderStatus = useSelector(foldersStatus);

    return (
        <AppWrapper>
            <Flex>
                <Heading ml={10} mb={6} size="lg">Folders</Heading>
                {
                    closeCreate ? (
                        <IconButton  ml={3} aria-label="Close create deck" size="md" icon={<AddIcon/>} onClick={openCreateComponent}/>
                    ) : null
                }
            </Flex>
            {
                closeCreate ? null : (
                    <Box p={10} pt={0}>
                        <CreateForm language={language} languageId={languageId} closeCreateComponent={closeCreateComponent} type='folder'/>
                    </Box>
                )
            }
            <Divider />
            <Box sx={styleProgress}>
                {
                    folderStatus === 'loading' && folderData.length === 0 ? (
                        <Stack>
                            <Skeleton height="30px" />
                            <Skeleton height="30px" />
                            <Skeleton height="30px" />
                        </Stack>
                    ) : (
                        <>
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
                        </>
                    )
                }
            </Box>
        </AppWrapper>
    );
}