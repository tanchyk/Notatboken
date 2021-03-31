import React from "react";
import {Heading, Stack, Flex, IconButton, useStyleConfig, Skeleton} from "@chakra-ui/react";
import {history} from "../../App";
import {BsArrowLeft} from "react-icons/all";
import {useSelector} from "react-redux";
import {foldersStatus} from "../../store/folderSlice";
import {decksStatus} from "../../store/deckSlice";

interface DecksWrapperProps {
    type: 'folder' | 'deck';
    title: string;
    w?: string;
}

export const AdditionalDecksWrapper: React.FC<DecksWrapperProps> = ({type, title, w="75%", children}) => {
    const styleStack = useStyleConfig("Stack");
    styleStack.borderLeftWidth = "6px";

    const loading = type === 'folder' ? useSelector(foldersStatus) : useSelector(decksStatus);

    const goBack = async () => {
        await history.goBack();
    }

    return (
        loading === 'loading' ? (
            <Stack mt={8} mb={8}>
                <Skeleton height="40px" />
                <Skeleton height="40px" />
                <Skeleton height="40px" />
                <Skeleton height="40px" />
                <Skeleton height="40px" />
                <Skeleton height="40px" />
            </Stack>
        ) : (
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
                    w={["100%", "100%", w, w]}
                >
                    <Heading as="h1" size="lg">{title}</Heading>
                    <IconButton aria-label="Go Back" size="sm" icon={<BsArrowLeft />} onClick={goBack}/>
                </Flex>
                <Stack spacing={6} w={["100%", "100%", w, w]}>
                    {children}
                </Stack>
            </Stack>
        )
    );
}