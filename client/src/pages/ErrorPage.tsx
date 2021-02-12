import React from "react";
import {Wrapper} from "../components/wrappers/Wrapper";
import {Stack, Box, Flex, Heading, Text, Link, Image, useStyleConfig} from "@chakra-ui/react";
import {
    Link as LinkPage
} from "react-router-dom";

export const ErrorPage: React.FC = () => {
    const styleStack = useStyleConfig("Stack");

    return (
        <Flex justifyContent="center">
            <Wrapper variant="regular">
                <Box
                    sx={styleStack}
                    w="100%"
                    padding={10}
                    margin={8}
                    spacing={5}
                >
                    <Stack direction="row" alignItems="center" flexWrap={["wrap", "wrap", "nowrap","nowrap"]}>
                        <Box textAlign="center" w={["100%", "100%", "100%", "50%"]}>
                            <Box w="83%" margin="auto">
                                <Heading fontSize="120px">404</Heading>
                                <Text fontSize="xl">Oooops, something went wrong, please go back to the <Link
                                    color="blue.500" as={LinkPage} to='/'>main page.</Link></Text>
                            </Box>
                        </Box>
                        <Box w={["100%", "100%", "100%", "50%"]}>
                            <Box boxSize={["240px", "240px", "300px", "360px"]} margin="auto">
                                <Image
                                    src="https://res.cloudinary.com/dw3hb6ec8/image/upload/v1612990203/notatboken/upload_moe1hr.png"
                                />
                            </Box>
                        </Box>
                    </Stack>
                </Box>
            </Wrapper>
        </Flex>
    );
}