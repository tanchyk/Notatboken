import React, {useEffect} from "react";
import {Flex, Heading, Text} from "@chakra-ui/react";
import {Wrapper} from "../components/wrappers/Wrapper";
import {useDispatch, useSelector} from "react-redux";
import {loadUser, userData} from "../store/userSlice";
import {LanguagesList} from "../components/startPage/LanguagesList";
import {UserStatistics} from "../components/startPage/UserStatistics";
import {AppDispatch} from "../store/store";

const StartPage: React.FC = () => {
    const user = useSelector(userData);

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(loadUser());
    }, [])

    return (
        <>
            <Flex
                justifyContent="center"
                backgroundColor="cyan.600"
                paddingTop={9}
                paddingBottom={9}
            >
                <Wrapper variant="regular">
                    <Heading color="white" fontSize="38px">{user.name ? user.name : user.username}</Heading>
                    <Text color="white">here you will se stats</Text>
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