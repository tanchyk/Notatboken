import React from "react";
import {Flex, Heading, Text} from "@chakra-ui/react";
import {Wrapper} from "../components/wrappers/Wrapper";
import {useSelector} from "react-redux";
import {userData} from "../store/userSlice";
import {LanguagesComponent} from "../components/startPage/LanguagesComponent";
import {StatisticsComponent} from "../components/startPage/StatisticsComponent";

const StartPage: React.FC = () => {
    const user = useSelector(userData);

    return (
        <>
            <Flex
                justifyContent="center"
                backgroundColor="cyan.600"
                paddingTop={10}
                paddingBottom={10}
            >
                <Wrapper variant="regular">
                    <Heading color="white" fontSize="38px">{user.name ? user.name : user.username}</Heading>
                    <Text color="white">here you will se stats</Text>
                </Wrapper>
            </Flex>
            <Flex justifyContent="center">
                <Wrapper variant="regular">
                    <LanguagesComponent/>
                    <StatisticsComponent/>
                </Wrapper>
            </Flex>
        </>
    );
}

export default StartPage;