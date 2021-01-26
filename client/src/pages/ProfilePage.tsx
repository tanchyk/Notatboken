import React from "react";
import {Flex, Stack, Text, Box, useStyleConfig} from "@chakra-ui/react";
import {Wrapper} from "../components/wrappers/Wrapper";
import {ChangePassword} from "../components/ChangePassword";

export const ProfilePage: React.FC<{}> = ({}) => {
    const styleStack = useStyleConfig("Stack");

    return (
        <Flex justifyContent="center">
            <Wrapper variant='small'>
                <Stack
                    sx={styleStack}
                    w={["100%", "90%", "40%", "30%"]}
                    padding={8}
                    paddingLeft={10}
                    marginTop={["0px", "0px", "30px", "30px"]}
                    spacing={8}
                >
                    <Text fontSize="lg">Basic Information</Text>
                    <Text fontSize="lg">Change Password</Text>
                    <Text fontSize="lg">Delete Account</Text>
                </Stack>
                <Box w={["100%", "90%", "55%", "66%"]}>
                    <ChangePassword/>
                </Box>
            </Wrapper>
        </Flex>
    );
}