import React, {useCallback, useEffect, useState} from "react";
import {Flex, Stack, Divider, Heading, Text, useStyleConfig} from "@chakra-ui/react";
import {DeckData} from "../../../utils/types";
import {useSelector} from "react-redux";
import {userData} from "../../../store/userSlice";

interface ProgressDataBoxProps {
    deck: DeckData;
}

interface ProgressType {
    forToday: number;
    notStudied: number;
    stillLearning: number;
    mastered: number;
}

export const ProgressDataBox: React.FC<ProgressDataBoxProps> = ({deck}) => {
    const styleStack = useStyleConfig("Stack");
    const [progress, setProgress] = useState<ProgressType>({
        forToday: 0, notStudied: 0, stillLearning: 0, mastered: 0
    })

    const loadData = useCallback(async () => {
        setProgress(await fetch(
            `/api/decks/progress/${deck.deckId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then(response => response.json()))
    }, [deck])

    useEffect(() => {
        loadData()
    }, [])

    const user = useSelector(userData);

    return (
        <Flex
            sx={styleStack}
            padding={5}
            paddingLeft={6}
            justifyContent="space-between"
            alignItems="center"
            direction="row"
            wrap="wrap"
        >
            <Stack spacing={4}>
                <Heading size="md">{deck.deckName}</Heading>
                <Stack direction="row" spacing={4} alignItems="center">
                    <Text fontSize="md" fontWeight="600" color="gray.500">{`${progress.forToday} cards to study today`}</Text>
                    <Divider orientation="vertical" h="18px"/>
                    <Text fontSize="md" fontWeight="600">{user.username}</Text>
                </Stack>
            </Stack>
            <Stack direction="row" spacing={3}>
                <Stack>
                    <Text fontSize="md" fontWeight="600" color="gray.500">Not Studied</Text>
                    <Heading size="md" color="red.500">{progress.notStudied}</Heading>
                </Stack>
                <Divider orientation="vertical" alignSelf="strech" h="auto"/>
                <Stack>
                    <Text fontSize="md" fontWeight="600" color="gray.500">Still Learning</Text>
                    <Heading size="md" color="green.500">{progress.stillLearning}</Heading>
                </Stack>
                <Divider orientation="vertical" alignSelf="strech" h="auto"/>
                <Stack>
                    <Text fontSize="md" fontWeight="600" color="gray.500">Mastered</Text>
                    <Heading size="md" color="blue.500">{progress.mastered}</Heading>
                </Stack>
            </Stack>
        </Flex>
    );
}