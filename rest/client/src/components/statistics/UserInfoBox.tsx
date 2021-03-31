import React from "react";
import {Heading, Text, Stack, Flex, Box, Icon, useStyleConfig, Image} from "@chakra-ui/react";
import {useSelector} from "react-redux";
import {userData} from "../../store/userSlice";
import {BiTimeFive} from "react-icons/all";
import {flags} from "../../utils/theme";
import {SimpleGrid} from "@chakra-ui/core";

export const UserInfoBox: React.FC = () => {
    const styleStack = useStyleConfig("Stack");

    const user = useSelector(userData);

    return (
        <Box>
            <Heading as="h1" fontSize="22px">User</Heading>
            <Stack
                sx={styleStack}
                padding={9}
                marginTop={5}
            >
                <SimpleGrid columns={2}>
                    <Stack>
                        <Heading as="h1" size="lg">{user.name ? user.name : user.username}</Heading>
                        {
                            user.name ? <Text fontSize="lg" fontWeight="600" color="gray.500">{user.username}</Text> : null
                        }
                        <Flex direction="row" alignItems="center">
                            <Icon as={BiTimeFive} mr={2} boxSize="18px"/>
                            <Text fontSize="lg" fontWeight="600">{`Joined ${new Date(user.createdAt!).toLocaleDateString('en-GB', {year: 'numeric', month: 'long', day: 'numeric' })}`}</Text>
                        </Flex>
                        <Stack direction="row" spacing={3}>
                            {
                                user.languages?.map(
                                    (language, index) =>
                                        <Image
                                            src={flags[language.languageName.toLowerCase() as keyof typeof flags]}
                                            w="40px"
                                            key={index}
                                            boxSize="32px"
                                        />
                                )
                            }
                        </Stack>
                    </Stack>
                    <Flex alignItems="center" justifyContent="center">
                        <Image
                            borderRadius="full"
                            boxSize="150px"
                            src={user.avatar!}
                        />
                    </Flex>
                </SimpleGrid>
            </Stack>
        </Box>
    );
}