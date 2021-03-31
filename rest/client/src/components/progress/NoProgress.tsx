import React from "react";
import {Link as LinkPage, useRouteMatch} from 'react-router-dom';
import {ProfileWrapper} from "../wrappers/ProfileWrapper";
import {Stack, Flex, Box, Heading, Text, Button, Image, SimpleGrid} from "@chakra-ui/react";

export const NoProgress: React.FC = () => {
    const match = useRouteMatch();

    return (
        <ProfileWrapper>
            <SimpleGrid columns={[1,1,1,1,2,2]} padding={[2,3,6,6]} minH="379.2px">
                <Flex alignItems="center" justifyContent="center">
                    <Stack spacing={5} w="80%">
                        <Heading size="lg">Progress with Notatboken</Heading>
                        <Text fontSize="lg">With the Progress page you can track your studying. You've got to add decks to use it!</Text>
                        <LinkPage to={`${match}/home`}>
                            <Button size="lg" w="110px">Decks Page</Button>
                        </LinkPage>
                    </Stack>
                </Flex>
                <Flex alignItems="center" justifyContent="center" mt={[8,8,6,0]}>
                    <Box boxSize={["200px","220px", "280px", "280px"]}>
                        <Image
                            src="https://res.cloudinary.com/dw3hb6ec8/image/upload/v1614498835/index/progress_ovx6aj.png"
                        />
                    </Box>
                </Flex>
            </SimpleGrid>
        </ProfileWrapper>
    );
}