import React from "react";
import {Link as LinkPage, useRouteMatch} from 'react-router-dom';
import {ProfileWrapper} from "../wrappers/ProfileWrapper";
import {Stack, Flex, Box, Heading, Text, Button, Image, SimpleGrid} from "@chakra-ui/react";

export const NoProgress: React.FC = () => {
    const match = useRouteMatch();

    return (
        <ProfileWrapper>
            <SimpleGrid columns={2} rows={1} padding={6} minH="379.2px">
                <Flex alignItems="center" justifyContent="center">
                    <Stack spacing={5} w="80%">
                        <Heading size="lg">Progress with <Box color="cyan.400">Notatboken</Box></Heading>
                        <Text fontSize="lg">With the Progress page you can track your studying. You've got to add decks to use it!</Text>
                        <LinkPage to={`${match}/home`}>
                            <Button size="lg" w="110px">Decks Page</Button>
                        </LinkPage>
                    </Stack>
                </Flex>
                <Flex alignItems="center" justifyContent="center">
                    <Image
                        boxSize="260px"
                        src="https://res.cloudinary.com/dw3hb6ec8/image/upload/v1613685173/notatboken/clipboard-2_yuae5n.png"
                    />
                </Flex>
            </SimpleGrid>
        </ProfileWrapper>
    );
}