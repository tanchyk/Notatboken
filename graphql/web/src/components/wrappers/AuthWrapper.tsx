import React from "react";
import {Box, Image, Link, Stack, useStyleConfig, SimpleGrid, Heading} from "@chakra-ui/react";
import NextLink from "next/link";
import {ExternalLinkIcon} from "@chakra-ui/icons";

interface AuthWrapperProps {
    page: string;
    src: string;
    to: string;
    text: string;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({page, src, to, text, children}) => {
    const styleStack = useStyleConfig("Stack");

    return (
        <SimpleGrid
            sx={styleStack}
            maxW={["100%", "80%", "70%", "60%", "50%", "50%"]}
            h={['100vh', "auto", "auto", "auto"]}
            padding={8}
            margin="auto"
            marginTop={["0px", "20px", "20px", "100px"]}
            columns={[1,1,1,1,2,2]}
            alignItems="center"
        >
            <Stack spacing={5} mb={[8,8,8,8,0,0]} textAlign="center" margin="auto">
                <Box boxSize={["300px", "300px", "390px", "390px"]}>
                    <Image
                        src={src}
                    />
                </Box>
                <NextLink href={to}>
                    <Link>
                        {text}
                        <ExternalLinkIcon mx="2px"/>
                    </Link>
                </NextLink>
            </Stack>
            <Stack spacing={5} w="80%" margin="auto">
                <Heading as="h1" size="xl">
                    {page}
                </Heading>
            {children}
            </Stack>
        </SimpleGrid>
    );
}