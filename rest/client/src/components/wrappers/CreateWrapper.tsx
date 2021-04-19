import React from 'react';
import {Box, CloseButton, Flex, Grid, GridItem, Image, Stack, useStyleConfig} from "@chakra-ui/react";

interface CreateWrapperProps {
    src: string;
    closeCreateComponent: () => void;
}

export const CreateWrapper: React.FC<CreateWrapperProps> = ({src, closeCreateComponent, children}) => {
    const styleStack = useStyleConfig("Stack");
    styleStack.borderBottomWidth = "6px";

    return (
        <Box
            sx={styleStack}
            padding={8}
        >
            <Flex direction="row" justifyContent="space-between">
                <Grid
                    templateRows="repeat(1, 1fr)"
                    templateColumns="repeat(5, 1fr)"
                    gap={8}
                    mr={8}
                    w="100%"
                >
                    <GridItem colSpan={[5,5,2,2]}>
                        <Box boxSize="200px" pt={src.includes('folder') ? '25px' : '0px'}>
                            <Image
                                src={src}
                            />
                        </Box>
                    </GridItem>
                    <GridItem colSpan={[5, 5, 3, 3]}>
                        <Stack spacing={5}>
                            {children}
                        </Stack>
                    </GridItem>
                </Grid>
                <CloseButton onClick={closeCreateComponent}/>
            </Flex>
        </Box>
    );
}