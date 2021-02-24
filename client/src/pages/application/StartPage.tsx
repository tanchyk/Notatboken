import React from "react";
import {Flex, Heading, GridItem} from "@chakra-ui/react";
import {Wrapper} from "../../components/wrappers/Wrapper";
import {useSelector} from "react-redux";
import {userData} from "../../store/userSlice";
import {LanguagesList} from "../../components/startPage/LanguagesList";
import {UserStatistics} from "../../components/startPage/UserStatistics";
import {AppWrapper} from "../../components/wrappers/AppWarpper";
import {Grid} from "@chakra-ui/core";

const StartPage: React.FC = () => {
    const user = useSelector(userData);

    return (
        <>
            <AppWrapper>
                <Heading color="white" fontSize="38px">{user.name ? user.name : user.username}</Heading>
            </AppWrapper>
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
                        <GridItem colSpan={[5,5,3,3]}>
                            <LanguagesList/>
                        </GridItem>
                        <GridItem colSpan={[5,5,2,2]}>
                            <UserStatistics/>
                        </GridItem>
                    </Grid>
                </Wrapper>
            </Flex>
        </>
    );
}

export default StartPage;