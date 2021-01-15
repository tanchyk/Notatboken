import React from "react";
import {
    Link as LinkPage
} from "react-router-dom";
import {Box, Button, Flex, Heading, Image, Stack} from "@chakra-ui/react";

interface NavbarProps {

}

const NavBar: React.FC<NavbarProps> = ({}) => {
    const isAuth = false;
    let body;

    if (!isAuth) {
        body = (
            <>
                <LinkPage to="/login">
                    <Button
                        width="100px"
                        type="submit"
                        variantColor={'teal'}
                        mr={3}
                    >
                        Login
                    </Button>
                </LinkPage>
                <Button
                    width="100px"
                    type="submit"
                    variantColor={'teal'}
                >
                    Register
                </Button>
            </>
        );
    } else {
        body = (
            <Flex>
                <Button
                    variant="link" color="white"
                >
                    Log out
                </Button>
            </Flex>
        );
    }

    return (
        <Flex bg="#fff" p={3} justifyContent="center">
            <Flex direction="row" justifyContent="space-between" width={["100%", "90%", "80%", "70%"]}>
                <Stack direction="row" spacing={3} alignItems="center">
                    <Box boxSize="40px" direction="row">
                        <Image
                            src="https://www.flaticon.com/svg/vstatic/svg/2921/2921222.svg?token=exp=1610654508~hmac=6503d46057215c9340a5269d8515aa57"
                        />
                    </Box>
                    <Heading as="h1" size="lg">
                        Notatboken
                    </Heading>
                </Stack>
                <Box>
                    {body}
                </Box>
            </Flex>
        </Flex>
    );
}

export default NavBar;