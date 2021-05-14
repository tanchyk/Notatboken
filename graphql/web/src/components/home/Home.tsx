import React from "react";
import {Flex, Grid, GridItem, Heading, Image, Stack, Text,} from "@chakra-ui/react";
import { NameWrapper } from "../wrappers/NameWrapper";
import { Wrapper } from "../wrappers/Wrapper";
import { LanguagesList } from "./LanguageList";

interface HomeProps {
    avatar: string;
    name: string | undefined | null;
    username: string;
}

export const Home: React.FC<HomeProps> = ({avatar, name, username}) => {
    return (
        <>
            <NameWrapper>
                <Flex direction="row" alignItems="center">
                    <Image
                        src={avatar}
                        borderRadius="full"
                        boxSize="100px"
                    />
                    <Stack ml={6} spacing={1}>
                        <Heading color="white" size="xl">{name ? name : username}</Heading>
                        <Text color="white" fontSize="lg" fontWeight="600">Notatboken member</Text>
                    </Stack>
                </Flex>
            </NameWrapper>
            <Flex justifyContent="center">
                <Wrapper variant="regular">
                    <Grid
                        templateRows="repeat(1, 1fr)"
                        templateColumns="repeat(5, 1fr)"
                        gap={10}
                        paddingTop={8}
                        paddingBottom={8}
                        w="100%"
                    >
                        <GridItem colSpan={[5, 5, 3, 3]}>
                            <LanguagesList/>
                        </GridItem>
                        <GridItem colSpan={[5, 5, 2, 2]}>
                            {/*<UserStatistics/>*/}
                            <Heading>Stats future</Heading>
                        </GridItem>
                    </Grid>
                </Wrapper>
            </Flex>
        </>
    );
}