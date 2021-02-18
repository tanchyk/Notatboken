import React from "react";
import {FolderData} from "../../utils/types";
import {Box, Flex, Heading, useStyleConfig} from "@chakra-ui/react";
import {FolderMenu} from "./FodlerMenu";
// import {Link as LinkPage} from "react-router-dom";

interface FolderBoxProps {
    folder: FolderData;
}

export const FolderBox: React.FC<FolderBoxProps> = ({folder}) => {
    const styleStack = useStyleConfig("Stack");
    styleStack.borderRightWidth = "8px"

    return (
        // <LinkPage to={`/decks/${folder.language!.languageName}/review/folders/${folder.folderId}`}>
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
                    <Box onClick={(event: React.MouseEvent) => event.preventDefault()}>
                        <FolderMenu folder={folder}/>
                    </Box>
                </Flex>
            </Box>
        // </LinkPage>
    );
}