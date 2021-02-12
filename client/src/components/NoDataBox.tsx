import React from "react";
import {Box, Flex, Heading, Text, useStyleConfig} from "@chakra-ui/react";

interface NoDataBoxProps {
    type: 'cards' | 'decks';
}

export const NoDataBox: React.FC<NoDataBoxProps> = ({type}) => {
    const styleStack = useStyleConfig("Stack");

    return (
        <Box
            sx={styleStack}
            h="150px"
            mt={5}
            padding={10}
            spacing={5}
        >
            <Flex alignItems="center" direction="column">
                <Heading as="h1" size="lg">{`You have no ${type} yet`}</Heading>
                <Text fontSize="lg" mt={2}>{`${type.charAt(0).toUpperCase() + type.slice(1)} you create or study will be displayed here.`}</Text>
            </Flex>
        </Box>
    );
}