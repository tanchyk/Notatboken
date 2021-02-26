import React, {useMemo, useState} from "react";
import {ProfileWrapper} from "../wrappers/ProfileWrapper";
import {Box, Button, Flex, Stack, Heading, Image, Text, useStyleConfig, useToast} from "@chakra-ui/react";
import {useDispatch, useSelector} from "react-redux";
import {updateGoal, userData} from "../../store/userSlice";
import {AppDispatch} from "../../store/store";

export const UserGoal: React.FC<{}> = () => {
    const styleStack = useStyleConfig("Stack");
    const toast = useToast();

    const [goal, setGoal] = useState<number | null>(null);

    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector(userData);

    const handleSend = async () => {
        await dispatch(updateGoal({userGoal: goal!}));
            toast({
                position: 'bottom',
                title: "Goal is updated.",
                description: "We've updated your account for you.",
                status: "success",
                duration: 9000,
                isClosable: true,
            });
    }

    useMemo(() => {
        setGoal(user.userGoal);
    }, [user])

    return (
        <ProfileWrapper>
            <Flex direction="row">
                <Heading size="lg">
                    Your Goal
                </Heading>
                <Text fontSize="20px" ml={2}>🎉</Text>
            </Flex>
            <Box
                sx={styleStack}
                padding={8}
                paddingTop={0}
            >
                <Flex direction="row" wrap="wrap" justifyContent={["center", "", "", ""]}>
                    <Box minW="50%">
                        <Image boxSize="170px" src="https://res.cloudinary.com/dw3hb6ec8/image/upload/v1613770970/notatboken/medal_c511pf.png"/>
                    </Box>
                    <Stack spacing="0px" margin="auto" mt={8} minW={["80%", "60%", "80%", "50%"]}>
                        <Button
                            variant="outline"
                            colorScheme={goal === 5 ? "blue" : "gray"}
                            size="lg"
                            borderBottomRadius={0}
                            onClick={() => setGoal(5)}
                            justifyContent="space-between"
                        >
                                <Heading size="md">Basic</Heading>
                                <Text fontSize="md" fontWeight="600" color="gray.500">5 cards</Text>
                        </Button>
                        <Button
                            variant="outline"
                            colorScheme={goal === 10 ? "blue" : "gray"}
                            size="lg"
                            borderRadius={0}
                            onClick={() => setGoal(10)}
                            justifyContent="space-between"
                        >
                                <Heading size="md">Regular</Heading>
                                <Text fontSize="md" fontWeight="600" color="gray.500">10 cards</Text>
                        </Button>
                        <Button
                            variant="outline"
                            colorScheme={goal === 15 ? "blue" : "gray"}
                            size="lg"
                            borderRadius={0}
                            onClick={() => setGoal(15)}
                            justifyContent="space-between"
                        >
                                <Heading size="md">Medium</Heading>
                                <Text fontSize="md" fontWeight="600" color="gray.500">15 cards</Text>
                        </Button>
                        <Button
                            variant="outline"
                            colorScheme={goal === 20 ? "blue" : "gray"}
                            size="lg"
                            borderTopRadius={0}
                            onClick={() => setGoal(20)}
                            justifyContent="space-between"
                        >
                                <Heading size="md">Serious</Heading>
                                <Text fontSize="md" fontWeight="600" color="gray.500">20 cards</Text>
                        </Button>
                    </Stack>
                </Flex>
            </Box>
            <Button
                width="120px"
                type="submit"
                size="lg"
                isDisabled={user.userGoal === goal}
                onClick={handleSend}
            >
                Update Goal
            </Button>
        </ProfileWrapper>
    );
}