import React from "react";
import {Box, Flex, Heading, Text, Link, Image, useStyleConfig, SimpleGrid} from "@chakra-ui/react";
import NextLink from "next/link";

const Custom404: React.FC = () => {
    const styleStack = useStyleConfig("Stack");

    return (
        <SimpleGrid
            sx={styleStack}
            maxW={["100%", "80%", "70%", "60%", "50%", "50%"]}
            h={['100vh', "auto", "auto", "auto"]}
            padding={8}
            margin="auto"
            marginTop={["0px", "20px", "20px", "100px"]}
            columns={[1, 1, 1, 1, 2, 2]}
            alignItems="center"
        >
            <Flex alignItems="center" justifyContent="center" textAlign="center">
                <Box w="80%">
                    <Heading fontSize="120px">404</Heading>
                    <Text fontSize="xl">
                        {"Oooops, something went wrong, please go back to the "}
                        <NextLink href="/">
                            <Link color="blue.500">main page</Link>
                        </NextLink>
                        .
                    </Text>
                </Box>
            </Flex>
            <Flex boxSize={["240px", "240px", "300px", "360px"]} alignItems="center" margin="auto">
                <Image
                    src="https://res.cloudinary.com/dw3hb6ec8/image/upload/v1614528339/app/error_cdmky9.png"
                />
            </Flex>
        </SimpleGrid>
    );
}

export default Custom404;