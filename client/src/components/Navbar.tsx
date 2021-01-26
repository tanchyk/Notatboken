import React from "react";
import {
    Link as LinkPage
} from "react-router-dom";
import {Box, Button, Flex, Heading, Image, Stack} from "@chakra-ui/react";
import {useDispatch, useSelector} from "react-redux";
import {logoutUser, userData} from "../store/userSlice";
import {AppDispatch} from "../store/store";
import {history} from '../App';
import {Wrapper} from "./additional/Wrapper";

const NavBar: React.FC<{}> = ({}) => {
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector(userData);
    let body;

    const logoutHandler = () => {
        dispatch(logoutUser());
        history.push('/');
    }

    if (!!user.userId) {
        body = (
            <>
                <LinkPage to="/profile">
                    <Button
                        width="80px"
                        variant="ghost"
                        mr={2}
                    >
                        Profile
                    </Button>
                </LinkPage>
                <Button
                    width="80px"
                    type="submit"
                    variant="outline"
                    onClick={logoutHandler}
                >
                    Log out
                </Button>
            </>
        );
    } else {
        body = (
            <>
                <LinkPage to="/login">
                    <Button
                        width="80px"
                        variant="ghost"
                        mr={2}
                    >
                        Log in
                    </Button>
                </LinkPage>
                <LinkPage to="/register">
                    <Button
                        width="80px"
                        type="submit"
                        variant="outline"
                    >
                        Sign up
                    </Button>
                </LinkPage>
            </>
        );
    }

    return (
        <Flex bg="#fff" p={3} justifyContent="center" borderBottom="1px">
            <Wrapper variant='regular'>
                <Stack direction="row" spacing={3} alignItems="center">
                    <Box boxSize="36px" direction="row">
                        <Image
                            src="https://i.pinimg.com/564x/fb/ef/08/fbef08c391667ee0b09437a4ed96eb11.jpg"
                        />
                    </Box>
                    <LinkPage to="/">
                        <Heading as="h1" size="lg">
                            Notatboken
                        </Heading>
                    </LinkPage>
                </Stack>
                <Box>
                    {body}
                </Box>
            </Wrapper>
        </Flex>
    );
}

export default NavBar;