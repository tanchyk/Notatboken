import React from "react";
import {Flex, Heading} from "@chakra-ui/react";
import {Wrapper} from "../components/wrappers/Wrapper";
import {useSelector} from "react-redux";
import {userData} from "../store/userSlice";
import {LanguagesList} from "../components/startPage/LanguagesList";
import {UserStatistics} from "../components/startPage/UserStatistics";
import {StreakBox} from "../components/statistics/StreakBox";

const StartPage: React.FC = () => {
    const user = useSelector(userData);

    return (
        <>
            <Flex
                justifyContent="center"
                backgroundColor="cyan.600"
                paddingTop={8}
                paddingBottom={8}
            >
                <Wrapper variant="regular">
                    <Flex alignItems="center" justifyContent="space-between" w="100%">
                        <Heading color="white" fontSize="38px">{user.name ? user.name : user.username}</Heading>
                        <StreakBox />
                    </Flex>
                </Wrapper>
            </Flex>
            <Flex justifyContent="center">
                <Wrapper variant="regular">
                    <LanguagesList/>
                    <UserStatistics/>
                </Wrapper>
            </Flex>
        </>
    );
}

export default StartPage;