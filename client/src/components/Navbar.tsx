import React from "react";
import {
    Link as LinkPage
} from "react-router-dom";
import {Box, Button, Flex, Heading, Image, Stack} from "@chakra-ui/react";
import {useDispatch, useSelector} from "react-redux";
import {logoutUser, userData} from "../store/userSlice";
import {AppDispatch} from "../store/store";
import {history} from '../App';
import {Wrapper} from "./wrappers/Wrapper";

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
                <LinkPage to="/">
                    <Stack direction="row" spacing={3} alignItems="center">
                        <Box boxSize="36px" direction="row">
                            <Image
                                src="https://lh3.googleusercontent.com/Q5WmMH6PF_N91BGk-HXKs3AXDXmO8FtsSCgLVKiF82RfjTD1YDftU49cRoWmhxjzu5TViWMp4PiyoTydJvnlF83ZghqxLyabqpaFn5YrXj6xfICHZRcLWd47hCCCDtpJ3ugW4DhFwHFCoSu_UMtk8OpuKy29PSLUDhx4fwSbxfR50vwmopLLOqcCO_JA6KpY-JBUHDpAUEoP9jfXsyOt0AlEjKt-RX468047KdZRZI7progzbgPPbl0lkFyx9_IfL1MpHZ2Jgl4sHGMQMDyTNMLHlRqxNs0i3Cy6NEWKKwMF7KFAX9vzrqw96M8cx1Dz_v5inEgSsAu1HIqvI49-YghqUUZWwViCcFPqcJQkJ3zWdKHZ2VS8ZqdyuDPkNsb1PVzbTv8FcJ7O9oRNMZ_WjGySsq8lEwasIya9A5ZU6wq466KlSL5fUalDSXuji9D3quSdm9YDA_8NFSpSG4SJgGCeECXajKSHM1PKcdE5_jCNabfWiRqbFZrWlfMnV75qoGlcODnaMhOLaGqUjLl-QOpB4wZulAFEYobi_lInXVLifX2Wlv9VBsfuOIfQGiMHPNef202OM_pidt8uJwInZAV99-HtAxr4Kifcf8Owlo2nxX1VsSwlqm9PDemaSMpBGt4ZQ8ar8v_d4Uf4W0llys-Vy6slsf-_a8Z-1ZN52CxXQOUQw7GPTbv4iskN=s512-no?authuser=0"
                            />
                        </Box>
                        <Heading as="h1" size="lg">
                            Notatboken
                        </Heading>
                    </Stack>
                </LinkPage>
                <Box>
                    {body}
                </Box>
            </Wrapper>
        </Flex>
    );
}

export default NavBar;