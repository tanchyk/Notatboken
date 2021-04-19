import React, {useEffect, useState} from "react";
import {Box, Heading, Stack, useStyleConfig} from "@chakra-ui/react";
import {Pie} from "react-chartjs-2";
import {useSelector} from "react-redux";
import {userData} from "../../store/userSlice";
import {langColors} from "../../utils/theme";
import {LangCards} from "../startPage/UserStatistics";
import {getRequest} from "../../store/requestFunction";

export const CardsPieChart: React.FC = () => {
    const styleStack = useStyleConfig("Stack");

    const user = useSelector(userData);

    const [langCards, setLangCards] = useState<Array<LangCards> | null>(null);

    const loadData = async () => {
        setLangCards(await getRequest("/statistics/get-language-stats").then(response => response.json()))
    }

    useEffect(() => {
        loadData()
    }, [])

    const data = {
        labels: user.languages?.map(language => language.languageName),
        datasets: [
            {
                label: '# of Card Reviews',
                data: langCards?.map(langData => langData.amount),
                backgroundColor: user.languages?.map(language => langColors[language.languageName as keyof typeof langColors].backgroundColor),
                borderColor: user.languages?.map(language => langColors[language.languageName as keyof typeof langColors].borderColor),
                borderWidth: 1,
            },
        ],
    }

    return (
        <Box>
            <Heading as="h1" fontSize="22px">All Cards</Heading>
            <Stack
                sx={styleStack}
                padding={4}
                marginTop={5}
            >
                <Pie data={data} />
            </Stack>
        </Box>
    );
}