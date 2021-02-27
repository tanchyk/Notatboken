import React, {useContext, useEffect} from "react";
import {
    Link as LinkPage,
    useRouteMatch
} from "react-router-dom";
import {
    Box,
    Button,
    Avatar,
    Flex,
    Heading,
    Image,
    IconButton,
    Stack,
    useDisclosure, Menu, MenuDivider, MenuButton, MenuItem, MenuList, useStyleConfig
} from "@chakra-ui/react";
import {useDispatch, useSelector} from "react-redux";
import {logoutUser, userData} from "../../store/userSlice";
import {AppDispatch} from "../../store/store";
import {history, LanguageContext} from '../../App';
import {Wrapper} from "../wrappers/Wrapper";
import {ColorModeSwitcher} from "./ColorModeSwitcher";
import {CloseIcon } from '@chakra-ui/icons'
import { FaUser, HiMenu, IoLanguageOutline, MdExitToApp} from "react-icons/all";
import {NavbarProfile} from "../profile/navigation/NavbarProfile";
import {NavDecks} from "../decks/NavDecks";

const NavBar: React.FC<{}> = ({}) => {
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector(userData);
    let body;

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [language] = useContext(LanguageContext);
    const match = useRouteMatch();

    useEffect(() => {
        if(isOpen) {
            onClose();
        }
    }, [match])

    const handleClick = () => {
        isOpen ? onClose() : onOpen()
    }

    const logoutHandler = () => {
        dispatch(logoutUser());
        history.push('/');
    }

    if (!!user.userId) {
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
                            icon={isOpen ? <CloseIcon /> : <HiMenu />}
                            onClick={handleClick}
                        />
                    ) : null
                }
                <Menu placement="bottom-end">
                    <MenuButton
                        size="md"
                        variant="outline"
                        borderRadius="full"
                    >
                        <Avatar size="md" name={user.username!} src={user.avatar!} />
                    </MenuButton>
                    <MenuList w="260px">
                        <LinkPage to="/profile">
                            <MenuItem icon={<FaUser/>}>
                                Profile
                            </MenuItem>
                        </LinkPage>
                        <LinkPage to="/">
                            <MenuItem icon={<IoLanguageOutline/>}>
                                Languages
                            </MenuItem>
                        </LinkPage>
                        <MenuDivider/>
                        <MenuItem icon={<MdExitToApp />} onClick={logoutHandler}>
                            Log out
                        </MenuItem>
                    </MenuList>
                </Menu>
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

    const main = useStyleConfig("NavbarMain");
    const auth = useStyleConfig("NavbarAuth");

    return (
        <Flex sx={!!user.userId ? auth : main} p={3} justifyContent="center">
            <Wrapper variant='regular' direction="column">
                <Flex justifyContent="space-between">
                    <LinkPage to="/">
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
                    </LinkPage>
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
                                    <NavbarProfile url='/profile' /> : <NavDecks url={`/decks/${language}`} />
                            }
                        </Stack>
                    ) : null
                }
            </Wrapper>
        </Flex>
    );
}

export default NavBar;