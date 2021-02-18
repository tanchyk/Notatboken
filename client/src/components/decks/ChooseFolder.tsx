import React, {useEffect, useState} from "react";
import {
    match
} from 'react-router-dom';
import {
    fetchFolder,
    foldersData,
    clearFolders,
    clearFolderError,
    addDeckToFolder
} from "../../store/folderSlice";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../../store/store";
import {AdditionalDecksWrapper} from "../wrappers/AdditionalDecksWrapper";
import {DeckSliceType, FolderData} from "../../utils/types";
import {decksStatus, singleDeck} from "../../store/deckSlice";
import {history} from "../../App";
import {NoDataBox} from "../NoDataBox";
import {SimpleGrid, Box, Stack, Flex, Button, Icon, Heading, useStyleConfig} from "@chakra-ui/react";
import {FolderBox} from "../folders/boxes/FolderBox";
import {FiFolderPlus} from "react-icons/all";

interface AddDeckToFolderProps {
    match: match<{deckId: string}>;
}

export const  ChooseFolder: React.FC< AddDeckToFolderProps> = ({match}) => {
    const styleStack = useStyleConfig("Stack");
    const deckId = Number.parseInt(match.params.deckId);

    const [chosenFolder, setChosenFolder] = useState<FolderData | null>(null);

    const handleChoose = (folder: FolderData) => {
        setChosenFolder(folder);
    }

    const dispatch = useDispatch<AppDispatch>();
    const deck = useSelector((state: {decks: DeckSliceType}) => singleDeck(state, deckId));
    const deckStatus = useSelector(decksStatus);
    const folderData = useSelector(foldersData);

    const handleAddToFolder = async (folderId: number) => {
        await dispatch(addDeckToFolder({folderId, deckId}));
        await history.goBack();
    }

    useEffect(() => {
        if(deck === undefined && deckStatus === 'succeeded') {
            history.push('/error');
        }
        if(deck && deckStatus === 'succeeded') {
            dispatch(clearFolders())
            dispatch(clearFolderError())
            dispatch(fetchFolder({languageId: deck.language!.languageId}))
        }
    }, [deckStatus])

    return (
        <AdditionalDecksWrapper title={`Choose Folder for ${deck?.deckName} deck 🗄️️`}>
            {
                folderData.length === 0 ? <NoDataBox type="folders"/> : (
                    <Stack spacing={5}>
                        {
                            chosenFolder ? (
                                <Flex direction="row">
                                    <Flex sx={styleStack} pl={4} mr={3} w="100%" alignItems="center">
                                        <Icon boxSize="20px" as={FiFolderPlus} mr={3} />
                                        <Heading size="md">{chosenFolder.folderName}</Heading>
                                    </Flex>
                                    <Button
                                        variant="solid"
                                        w="180px"
                                        onClick={() => handleAddToFolder(chosenFolder.folderId!)}
                                    >Choose Folder</Button>
                                </Flex>
                            ) : null
                        }
                        <SimpleGrid columns={2} spacing={4} marginBottom={4}>
                            {
                                folderData.map((folder, index) => (
                                        <Box
                                            onClick={() => handleChoose(folder)}
                                            _hover={{cursor: "pointer"}}
                                            key={index}
                                        >
                                            <FolderBox folder={folder} from="decks"/>
                                        </Box>
                                    )
                                )
                            }
                        </SimpleGrid>
                    </Stack>
                )
            }
        </AdditionalDecksWrapper>
    );
}