import React, {useEffect, useState} from "react";
import {Button, Flex, Heading, Image, Stack, Text, useStyleConfig} from "@chakra-ui/react";
import {Link as LinkPage} from "react-router-dom";
import {flags} from "../../utils/theme";
import {LangCards} from "./UserStatistics";

export const LanguageStats: React.FC = () => {
    const styleStack = useStyleConfig("Stack");
    const bgText = useStyleConfig("BgText");

    const [langCards, setLangCards] = useState<Array<LangCards> | null>(null);

    const loadData = async () => {
        setLangCards(await fetch(
            "/api/statistics/get-language-stats", {
                method: 'GET'
            }
        ).then(response => response.json()))
    }

    useEffect(() => {
        loadData()
    }, [])

    return (
        <Flex
            sx={styleStack}
            padding={8}
            marginTop={5}
        >
            <Stack spacing={4}>
                <Heading as="h1" size="lg">Cards Created</Heading>
                <Button size="lg" maxW="140px">
                    <LinkPage to="/statistics">
                        More Statistics
                    </LinkPage>
                </Button>
            </Stack>
            <Stack sx={styleStack} spacing={1} padding={4} ml={8}>
                {
                    langCards && langCards.length > 0 ? (
                        langCards?.map((stats, index) => (
                            <Flex direction="row" key={index} mr={2}>
                                <Image w="28px" src={flags[stats.languageName.toLowerCase() as keyof typeof flags]}/>
                                <Text sx={bgText} ml={3}>{stats.amount + " cards"}</Text>
                            </Flex>
                        ))
                    ) : <Text sx={bgText}>No Languages</Text>
                }
            </Stack>
        </Flex>
    );
}