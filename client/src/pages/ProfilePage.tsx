import React from "react";
import {Flex, Stack, Text, Box} from "@chakra-ui/react";
import {Wrapper} from "../utils/Wrapper";
import {BasicInformation} from "../components/BasicInformation";

export const ProfilePage: React.FC<{}> = ({}) => {
    return (
        <Flex justifyContent="center">
            <Wrapper variant='small'>
                <Stack
                    w={["100%", "90%", "40%", "30%"]}
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                    padding={8}
                    paddingLeft={10}
                    backgroundColor="#fff"
                    marginTop={["0px", "0px", "30px", "30px"]}
                    spacing={8}
                >
                    <Text fontSize="lg">Basic Information</Text>
                    <Text fontSize="lg">Change Password</Text>
                    <Text fontSize="lg">Delete Account</Text>
                </Stack>
                <Box w={["100%", "90%", "55%", "66%"]}>
                    <BasicInformation/>
                </Box>
            </Wrapper>
        </Flex>
    );
}