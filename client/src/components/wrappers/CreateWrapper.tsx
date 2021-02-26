import React from 'react';
import {Box, CloseButton, Flex, Image, Stack, useStyleConfig} from "@chakra-ui/react";

interface CreateWrapperProps {
    src: string;
    closeCreateComponent: () => void;
}

export const CreateWrapper: React.FC<CreateWrapperProps> = ({src, closeCreateComponent, children}) => {
    const styleStack = useStyleConfig("Stack");
    styleStack.borderLeftWidth = "6px";

    return (
        <Box
            sx={styleStack}
            padding={9}
            spacing={5}
        >
            <Flex direction="row" justifyContent="space-between">
                <Flex direction={['column', "row","row","row"]}>
                    <Box boxSize="170px">
                        <Image
                            src={src}
                        />
                    </Box>
                    <Stack w={["90%","60%","60%","60%"]} spacing={5} ml={[0,8,8,8]} mt={[8,0,0,0]}>
                        {children}
                    </Stack>
                </Flex>
                <CloseButton onClick={closeCreateComponent}/>
            </Flex>
        </Box>
    );
}