import React from "react";
import {Heading, Stack, Flex, IconButton, useStyleConfig} from "@chakra-ui/react";
import {history} from "../../App";
import {BsArrowLeft} from "react-icons/all";

interface DecksWrapperProps {
    title: string;
}

export const AdditionalDecksWrapper: React.FC<DecksWrapperProps> = ({title, children}) => {
    const styleStack = useStyleConfig("Stack");
    styleStack.borderLeftWidth = "6px";

    const goBack = async () => {
        await history.goBack();
    }

    return (
        <Stack
            sx={styleStack}
            marginTop={8}
            marginBottom={8}
            padding={10}
            paddingLeft={12}
        >
            <Flex
                alignItems="center"
                justifyContent="space-between"
                mb={8}
                w="75%"
            >
                <Heading as="h1" size="lg">{title}</Heading>
                <IconButton aria-label="Go Back" size="sm" icon={<BsArrowLeft />} onClick={goBack}/>
            </Flex>
            <Stack spacing={6} w="75%">
                {children}
            </Stack>
        </Stack>
    );
}