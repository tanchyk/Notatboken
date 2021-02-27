import React, {useEffect, useState} from "react";
import {Flex, Stack, Image, Heading, Text, useStyleConfig, Progress} from "@chakra-ui/react";
import {useSelector} from "react-redux";
import {userData} from "../../store/userSlice";

export const DailyGoal: React.FC = () => {
    const styleStack = useStyleConfig("Stack");
    const bgText = useStyleConfig("BgText");

    const user = useSelector(userData);
    const [dayData, setDayData] = useState<number>(0)

    const loadData = async () => {
        const response = await fetch(
            "/api/statistics/get-card-day-review", {
                method: 'GET'
            }
        ).then(response => response.json())
        setDayData(response.amount);
    }

    useEffect(() => {
        loadData()
    }, [])

    return (
        <Flex
            sx={styleStack}
            padding={9}
            marginTop={5}
        >
            <Image
                boxSize="120px"
                src="https://res.cloudinary.com/dw3hb6ec8/image/upload/v1614457184/app/daily_goal_shoblz.png"
            />
            <Stack spacing={3} ml={6} w="100%">
                <Heading as="h1" size="lg" mb={2}>Daily Goal</Heading>
                <Heading as="h1" size="md" color="gray.500">Progress today</Heading>
                <Progress
                    size="lg"
                    w="100%"
                    borderRadius="md"
                    hasStripe
                    value={dayData !== 0 ? dayData / user.userGoal! * 100 : 0}
                />
                <Text sx={bgText}>{`${dayData}/${user.userGoal} cards`}</Text>
            </Stack>
        </Flex>
    );
}