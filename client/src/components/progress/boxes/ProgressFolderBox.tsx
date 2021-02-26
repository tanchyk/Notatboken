import React, {useCallback, useEffect, useState} from "react";
import {Flex, Stack, Box, Heading, Text, useStyleConfig, Progress} from "@chakra-ui/react";
import {FolderData} from "../../../utils/types";

interface ProgressFolderBoxProps {
    folder: FolderData;
}

interface ProgressType {
    amountOfDecks: number;
    amountOfCards: number;
    amountOfCardsLearned: number;
}

export const ProgressFolderBox: React.FC<ProgressFolderBoxProps> = ({folder}) => {
    const styleStack = useStyleConfig("Stack");
    const bgText = useStyleConfig("BgText");
    const [progress, setProgress] = useState<ProgressType>({
        amountOfDecks: 0, amountOfCards: 0, amountOfCardsLearned: 0
    })

    const loadData = useCallback(async () => {
        setProgress(await fetch(
            `/api/folders/progress/${folder.folderId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then(response => response.json()))
    }, [folder])

    useEffect(() => {
        loadData()
    }, [])

    return (
        <Flex
            sx={styleStack}
            padding={6}
            paddingLeft={7}
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            wrap="wrap"
        >
            <Stack spacing={1}>
                <Heading size="md">{folder.folderName}</Heading>
                <Text sx={bgText}>{`${progress.amountOfDecks} decks`}</Text>
                <Text sx={bgText}>{`${progress.amountOfCards} cards`}</Text>
            </Stack>
            <Stack spacing={2} minW="40%">
                <Text fontSize="md" fontWeight="600">Cards studied</Text>
                <Box>
                    <Progress borderRadius="md" hasStripe value={progress.amountOfCards !== 0 ? progress.amountOfCardsLearned/progress.amountOfCards * 100 : 0} />
                </Box>
            </Stack>
        </Flex>
    );
}