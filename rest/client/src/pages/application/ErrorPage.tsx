import React from "react";
import {Wrapper} from "../../components/wrappers/Wrapper";
import {Box, Flex, Heading, Text, Link, Image, useStyleConfig} from "@chakra-ui/react";
import {
    Link as LinkPage
} from "react-router-dom";
import {SimpleGrid} from "@chakra-ui/core";

export const ErrorPage: React.FC = () => {
    const styleStack = useStyleConfig("Stack");

    return (
        <Flex justifyContent="center">
            <Wrapper variant="regular">
                <Box
                    sx={styleStack}
                    w="100%"
                    padding={10}
                    marginTop={8}
                    marginBottom={8}
                    spacing={5}
                >
                    <SimpleGrid columns={[1,1,1,2]} spacing={10}>
                        <Flex alignItems="center" justifyContent="center" textAlign="center">
                            <Box w="80%">
                                <Heading fontSize="120px">404</Heading>
                                <Text fontSize="xl">Oooops, something went wrong, please go back to the <Link
                                    color="blue.500" as={LinkPage} to='/'>main page.</Link></Text>
                            </Box>
                        </Flex>
                            <Flex boxSize={["240px", "240px", "300px", "360px"]} alignItems="center" margin="auto">
                                <Image
                                    src="https://res.cloudinary.com/dw3hb6ec8/image/upload/v1614528339/index/error_cdmky9.png"
                                />
                            </Flex>
                    </SimpleGrid>
                </Box>
            </Wrapper>
        </Flex>
    );
}