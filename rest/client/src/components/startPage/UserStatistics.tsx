import React from "react";
import {Box, Heading} from "@chakra-ui/react";
import {DailyGoal} from "./DailyGoal";
import {LanguageStats} from "./LanguagesStats";

export interface LangCards {
    languageName: string;
    amount: number;
}

export const UserStatistics: React.FC = () => {
    return (
        <Box flexDirection="column">
            <Heading as="h1" fontSize="22px" marginTop={8}>Statistics</Heading>
            <DailyGoal />
            <LanguageStats />
        </Box>
    );
}