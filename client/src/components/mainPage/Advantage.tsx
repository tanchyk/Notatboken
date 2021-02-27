import React from "react";
import {Flex, Heading, Image, Stack, Text, useStyleConfig} from "@chakra-ui/react";

interface AdvantageProps {
    src: string;
    heading: string;
    text: string;
}

export const Advantage: React.FC<AdvantageProps> = ({src, heading, text}) => {
    const styleStack = useStyleConfig("Stack");

    return (
        <Flex
            sx={styleStack}
            padding="3rem"
        >
            <Image boxSize={["120px","120px","160px","160px"]} src={src}/>
            <Stack spacing={6} ml="3rem" minW="50%">
                <Heading size="lg">{heading}</Heading>
                <Text fontSize="lg">{text}</Text>
            </Stack>
        </Flex>
    );
}