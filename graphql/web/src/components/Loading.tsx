import React from "react";
import {Flex, Heading, Stack, Image, Spinner, useColorModeValue} from "@chakra-ui/react";

export const Loading: React.FC = () => {
    const bg = useColorModeValue("#fff", "gray.800")

    return (
        <Flex
            w="100%"
            h="100vh"
            bg={bg}
            alignItems="center"
            justifyContent="center"
        >
            <Flex>
                <Image
                    boxSize="100px"
                    src="https://res.cloudinary.com/dw3hb6ec8/image/upload/v1612990216/notatboken/notebook_b5bgvg.png"
                />
                <Stack spacing={5} ml={5}>
                    <Heading size="xl">Notatboken</Heading>
                    <Spinner
                        thickness="5px"
                        speed="0.7s"
                        emptyColor="gray.200"
                        color="#42c3e2"
                        size="xl"
                    />
                </Stack>
            </Flex>
        </Flex>
    )
}