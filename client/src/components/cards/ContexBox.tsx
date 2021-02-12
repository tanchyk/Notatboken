import React from "react";
import {useStyleConfig} from "@chakra-ui/react";
import {Box, Text} from "@chakra-ui/react";

interface ContexBoxProps {
    from: string;
    to: string;
}

export const ContextBox: React.FC<ContexBoxProps> = ({from, to}) => {
    const styleStack = useStyleConfig("Stack");
    styleStack.borderBottomWidth = "6px";

    return (
        <Box
            sx={styleStack}
            p={6}
        >
            <Box borderLeftWidth="4px" borderColor="blue.300" mb={5}>
                <Text fontSize="lg" ml={4}>
                    {from}
                </Text>
            </Box>
            <Box borderLeftWidth="4px" borderColor="blue.300">
                <Text fontSize="lg" ml={4}>
                    {to}
                </Text>
            </Box>
        </Box>
    );
}