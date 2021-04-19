import React from "react";
import {FolderData} from "../../../utils/types";
import {Box, Flex, Heading, useStyleConfig} from "@chakra-ui/react";
import {FolderMenu} from "../FodlerMenu";

interface FolderBoxProps {
    folder: FolderData;
    from: 'decks' | 'folders';
}

export const FolderBox: React.FC<FolderBoxProps> = ({folder, from}) => {
    const styleStack = useStyleConfig("Stack");
    styleStack.borderRightWidth = "8px"

    return (
        <Box
            sx={styleStack}
            h="120px"
            padding={4}
            _hover={{
                paddingRight: "12px",
                borderRightWidth: "10px"
            }}
        >
            <Flex direction="row" justifyContent="space-between">
                <Heading as="h1" fontSize="19px">{folder.folderName}</Heading>
                <Box onClick={
                    from === 'folders' ? (event: React.MouseEvent) => event.preventDefault()
                        : (event: React.MouseEvent) => event.stopPropagation()
                }>
                    <FolderMenu folder={folder}/>
                </Box>
            </Flex>
        </Box>
    );
}