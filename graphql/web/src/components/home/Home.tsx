import React from "react";
import {Flex, Grid, GridItem, Heading, Image, Stack, Text,} from "@chakra-ui/react";
import {User} from "../../generated/graphql";
import { NameWrapper } from "../wrappers/NameWrapper";
import { Wrapper } from "../wrappers/Wrapper";
import { LanguagesList } from "./LanguageList";

interface HomeProps {
    user: Pick<User, "id" | "name" | "username" | "userGoal" | "avatar" | "userLanguages">;
}

export const Home: React.FC<HomeProps> = ({user}) => {
    return (
        <>
            <NameWrapper>
                <Flex direction="row" alignItems="center">
                    <Image
                        src={user.avatar!}
                        borderRadius="full"
                        boxSize="100px"
                    />
                    <Stack ml={6} spacing={1}>
                        <Heading color="white" size="xl">{user.name ? user.name : user.username}</Heading>
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