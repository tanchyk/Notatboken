import React from "react";
import {Stack, Heading, Text, useStyleConfig} from "@chakra-ui/react";
import {useSelector} from "react-redux";
import {streakData} from "../../store/streakSlice";

export const StreakBox: React.FC = () => {
    const styleStack = useStyleConfig("Stack");

    const streak = useSelector(streakData);

    return (
        <Stack
            sx={styleStack}
            padding={3}
            justifyContent="center"
        >
            <Stack direction="row" spacing={2}>
                <Heading size="md">🔥</Heading>
                <Stack spacing="-2px">
                    <Heading size="md">{streak}</Heading>
                    <Text fontSize="lg" fontWeight="600" color="gray.500">Day streak</Text>
                </Stack>
            </Stack>
        </Stack>
    )
}