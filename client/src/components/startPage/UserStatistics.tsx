import React, {useEffect, useState} from "react";
import {Box, Heading, Stack, Flex, Button, Text, useStyleConfig, Image} from "@chakra-ui/react";
import {flags} from "../../utils/theme";
import {ProgressBar} from "../statistics/ProgressBar";

interface LangCards {
    languageName: string;
    amount: number;
}

export const UserStatistics: React.FC = () => {
    const styleStack = useStyleConfig("Stack");

    const [langCards, setLangCards] = useState<Array<LangCards> | null>(null);

    const loadData = async () => {
        setLangCards(await fetch(
            "/api/statistics/get-language-stats", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then(response => response.json()))
    }

    useEffect(() => {
        loadData()
    }, [])

    return (
        <Box flexDirection="column" w="27%">
            <Heading as="h1" fontSize="22px" marginTop={8}>Statistics 📋</Heading>
            <Box
                sx={styleStack}
                marginRight={0}
                padding={9}
                marginTop={5}
            >
                <Heading as="h1" size="md">Your Statistics</Heading>
                <Stack
                    spacing={3}
                    marginTop={5}
                >
                    <Box w="80%">
                        <ProgressBar />
                    </Box>
                    <Stack spacing={1}>
                        <Text fontSize="lg" fontWeight="600">Cards Created</Text>
                        {
                            langCards && langCards.length > 0 ? (
                                langCards?.map((stats, index) => (
                                    <Flex direction="row" key={index} mr={2}>
                                        <Image w="28px" src={flags[stats.languageName.toLowerCase() as keyof typeof flags]}/>
                                        <Text fontSize="md" fontWeight="600" color="gray.500" ml={3}>{stats.amount + " cards"}</Text>
                                    </Flex>
                                ))
                            ) : <Text fontSize="md" fontWeight="600" color="gray.500">No Languages</Text>
                        }
                    </Stack>
                    <Button alignSelf="flex-end">
                        More Statistics
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
}