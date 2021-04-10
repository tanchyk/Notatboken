import React, {useMemo, useState} from "react";
import {Box, Button, Flex, Stack, Heading, Image, Text, useStyleConfig, useToast} from "@chakra-ui/react";
import {useEditGoalMutation, useMeQuery} from "../../generated/graphql";
import {AccountLayout} from "../../layouts/AccountLayout";
import {Layout} from "../../layouts/Layout";
import {withApollo} from "../../utils/withApollo";
import { AccountWrapper } from "../../components/wrappers/AccountWrapper";
import {Loading} from "../../components/Loading";
import Custom404 from "../404";
import {gql} from "@apollo/client/core";

const UserGoal: React.FC<{}> = () => {
    const styleStack = useStyleConfig("Stack");
    const toast = useToast();
    const {data, loading} = useMeQuery();
    const [editGoal, {loading: loadingEdit}] = useEditGoalMutation();

    const [goal, setGoal] = useState<number | null>(null);

    const handleSend = async () => {
        await editGoal({
            variables: {userGoal: goal ? goal : 5},
            update: (
                cache,
                {data: goalData}
            ) => {
                if(goalData?.editGoal.confirmed) {
                    cache.writeFragment({
                        id: "User:" + data?.me?.id,
                        fragment: gql(`
                            fragment _ on User {
                                id
                                userGoal
                            }
                        `),
                        data: { userGoal: goal!}
                    });
                }
            }
        });
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
        if(data?.me) {
            setGoal(data?.me.userGoal);
        }
    }, [data?.me])

    if(loading) {
        return <Loading />;
    } else if(!data?.me) {
        return <Custom404 />;
    }

    return (
        <Layout variant="small">
            <AccountLayout>
                <AccountWrapper>
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
                        isDisabled={data?.me!.userGoal === goal}
                        onClick={handleSend}
                        isLoading={loadingEdit}
                    >
                        Update Goal
                    </Button>
                </AccountWrapper>
            </AccountLayout>
        </Layout>
    );
}

export default withApollo({ssr: false})(UserGoal);