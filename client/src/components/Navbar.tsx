import React from "react";
import {
    Link as LinkPage
} from "react-router-dom";
import {Box, Button, Flex, Heading, Image, Stack, useColorModeValue} from "@chakra-ui/react";
import {useDispatch, useSelector} from "react-redux";
import {logoutUser, userData} from "../store/userSlice";
import {AppDispatch} from "../store/store";
import {history} from '../App';
import {Wrapper} from "./wrappers/Wrapper";
import {ColorModeSwitcher} from "./ColorModeSwitcher";

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

    const bgNavbar = useColorModeValue("#fff", "gray.700");

    return (
        <Flex bg={bgNavbar} p={3} justifyContent="center" borderBottom="1px">
            <Wrapper variant='regular'>
                <LinkPage to="/">
                    <Stack direction="row" spacing={3} alignItems="center">
                        <Box boxSize="36px" direction="row">
                            <Image
                                src="https://res.cloudinary.com/dw3hb6ec8/image/upload/v1612990216/notatboken/notebook_b5bgvg.png"
                            />
                        </Box>
                        <Heading as="h1" size="lg">
                            Notatboken
                        </Heading>
                    </Stack>
                </LinkPage>
                <Box>
                    <ColorModeSwitcher/>
                    {body}
                </Box>
            </Wrapper>
        </Flex>
    );
}

export default NavBar;