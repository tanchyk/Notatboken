import React, {useContext, useEffect} from "react";
import NextLink from "next/link";
import {
    Box,
    Button,
    Flex,
    Heading,
    Image,
    IconButton,
    Stack,
    useDisclosure,
    useStyleConfig
} from "@chakra-ui/react";
import {LanguageContext} from '../pages/_app';
import {Wrapper} from "./wrappers/Wrapper";
import {ColorModeSwitcher} from "./ColorModeSwitcher";
import {CloseIcon } from '@chakra-ui/icons';
import {HiMenu} from "react-icons/hi";
import {NavProfile} from "./navigation/NavProfile";
import {NavDecks} from "./navigation/NavDecks";
import {StreakNavbar} from "./navigation/StreakNavbar";
import {UserIcon} from "./navigation/UserIcon";
import {useLoginMutation, useMeQuery} from "../generated/graphql";
import {useApolloClient} from "@apollo/client";
import { useRouter } from 'next/router';

export const Navbar: React.FC = ({}) => {
    const apolloClient = useApolloClient();
    const {data} = useMeQuery();
    const [logout] = useLoginMutation();
    let body;

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [language] = useContext(LanguageContext);
    const router = useRouter();
    const url = router.pathname;

    useEffect(() => {
        if(isOpen) {
            onClose();
        }
    }, [url])

    const handleClick = () => {
        isOpen ? onClose() : onOpen()
    }

    const logoutHandler = async () => {
        await logout();
        await apolloClient.resetStore();
    }

    if (!!data?.me) {
        body = (
            <>
                {
                    window.location.pathname.includes('profile') || window.location.pathname.includes('decks') ? (
                        <IconButton
                            size="md"
                            fontSize="lg"
                            variant="ghost"
                            display={["inline-flex", "inline-flex", "none", "none", "none", "none"]}
                            aria-label="open drawer"
                            icon={isOpen ? <HiMenu /> : <CloseIcon />}
                            onClick={handleClick}
                        />
                    ) : null
                }
                <StreakNavbar />
                <UserIcon logoutHandler={logoutHandler} />
            </>
        );
    } else {
        body = (
            <>
                <NextLink href="/login">
                    <Button
                        width="80px"
                        variant="ghost"
                    >
                        Log in
                    </Button>
                </NextLink>
                <NextLink href="/register">
                    <Button
                        width="80px"
                        type="submit"
                        variant="outline"
                    >
                        Sign up
                    </Button>
                </NextLink>
            </>
        );
    }

    const main = useStyleConfig("NavbarMain");
    const auth = useStyleConfig("NavbarAuth");

    return (
        <Flex sx={!!data ? auth : main} p={3} justifyContent="center">
            <Wrapper variant='regular' direction="column">
                <Flex justifyContent="space-between">
                    <NextLink href="/">
                        <Stack direction="row" spacing={3} alignItems="center">
                            <Box boxSize="40px" direction="row">
                                <Image
                                    src="https://res.cloudinary.com/dw3hb6ec8/image/upload/v1612990216/notatboken/notebook_b5bgvg.png"
                                />
                            </Box>
                            <Heading as="h1" size="lg" display={["none", "none", "flex", "flex", "flex", "flex"]}>
                                Notatboken
                            </Heading>
                        </Stack>
                    </NextLink>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <ColorModeSwitcher/>
                        {body}
                    </Stack>
                </Flex>
                {
                    isOpen ? (
                        <Stack
                            display={{ sm: isOpen ? "flex" : "none", md: "none" }}
                            width="full"
                            paddingTop={8}
                            paddingBottom={8}
                            marginTop={8}
                        >
                            {
                                window.location.pathname.includes('profile') ?
                                    <NavProfile url='/profile' /> : <NavDecks url={`/decks/${language}`} />
                            }
                        </Stack>
                    ) : null
                }
            </Wrapper>
        </Flex>
    );
}