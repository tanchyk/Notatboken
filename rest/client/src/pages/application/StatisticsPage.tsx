import React from "react";
import {Wrapper} from "../../components/wrappers/Wrapper";
import {Flex, Grid, SimpleGrid, Heading, GridItem} from "@chakra-ui/react";
import {UserInfoBox} from "../../components/statistics/UserInfoBox";
import {ProgressBar} from "../../components/statistics/ProgressBar";
import {StreakBox} from "../../components/statistics/StreakBox";
import {WeekCardsReview} from "../../components/statistics/WeekCardsReview";
import {CardsPieChart} from "../../components/statistics/CardsPieChart";
import {useSelector} from "react-redux";
import {userData} from "../../store/userSlice";

export const StatisticsPage: React.FC = () => {
    const user = useSelector(userData);

    return (
        <Flex justifyContent="center">
            <Wrapper variant="regular">
                <Grid
                    templateRows={["repeat(4,auto)", "repeat(4, auto)", "repeat(2, auto)", "repeat(2, auto)"]}
                    templateColumns="repeat(2, 1fr)"
                    gap={10}
                    paddingTop={8}
                    paddingBottom={8}
                    w="100%"
                >
                    <GridItem colSpan={[2, 2, 1, 1]} h="242.7px">
                        <UserInfoBox/>
                    </GridItem>
                    <GridItem colSpan={[2, 2, 1, 1]}  h="242.7px">
                        <Heading as="h1" fontSize="22px">Statistics</Heading>
                        <SimpleGrid columns={2} spacing={4} marginTop={5}>
                            <StreakBox/>
                            <ProgressBar/>
                        </SimpleGrid>
                    </GridItem>
                    {
                        user.languages && user.languages.length === 0 ? null : (
                            <>
                                <GridItem colSpan={[2, 2, 1, 1]}>
                                    <CardsPieChart/>
                                </GridItem>
                                <GridItem colSpan={[2, 2, 1, 1]}>
                                    <WeekCardsReview/>
                                </GridItem>
                            </>
                        )
                    }
                </Grid>
            </Wrapper>
        </Flex>
    )
}