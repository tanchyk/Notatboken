import React from "react";
import {Box, Heading, useStyleConfig} from "@chakra-ui/react";

export const StatisticsComponent: React.FC = () => {
    const styleStack = useStyleConfig("Stack");

    return (
        <Box flexDirection="column" w="27%">
            <Heading as="h1" fontSize="22px" marginTop={8}>Statistics 📋</Heading>
            <Box
                sx={styleStack}
                marginRight={0}
                padding={9}
                marginTop={5}
                spacing={5}
            >
                <Box w="78%">
                    <Heading as="h1" size="md">Your Statistics</Heading>
                </Box>
            </Box>
        </Box>
    );
}