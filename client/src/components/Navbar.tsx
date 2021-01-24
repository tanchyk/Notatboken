import React from "react";
import {
    Link as LinkPage
} from "react-router-dom";
import {Box, Button, Flex, Heading, Image, Stack} from "@chakra-ui/react";
import {useDispatch, useSelector} from "react-redux";
import {logoutUser, userData} from "../store/userSlice";
import {AppDispatch} from "../store/store";
import {history} from '../App';
import {Wrapper} from "../utils/Wrapper";

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
                        width="100px"
                        type="submit"
                        variantсolor='teal'
                        mr={3}
                    >
                        Profile
                    </Button>
                </LinkPage>
                <Button
                    width="100px"
                    type="submit"
                    variantсolor={'teal'}
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
                        width="100px"
                        type="submit"
                        variantсolor='teal'
                        mr={3}
                    >
                        Login
                    </Button>
                </LinkPage>
                <LinkPage to="/register">
                    <Button
                        width="100px"
                        type="submit"
                        variantсolor='teal'
                    >
                        Register
                    </Button>
                </LinkPage>
            </>
        );
    }

    return (
        <Flex bg="#fff" p={3} justifyContent="center" borderBottom="1px">
            <Wrapper variant='regular'>
                <Stack direction="row" spacing={3} alignItems="center">
                    <Box boxSize="40px" direction="row">
                        <Image
                            src="https://www.flaticon.com/svg/vstatic/svg/2921/2921222.svg?token=exp=1610654508~hmac=6503d46057215c9340a5269d8515aa57"
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