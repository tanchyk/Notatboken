import React, {useMemo, useState} from "react";
import NextLink from "next/link";
import {NavItemProfile} from "./NavItemProfile";
// import {FaRegFolderOpen, GiProgression, IoLanguageOutline, RiHome4Line} from "react-icons/all";
import {CloseIcon} from '@chakra-ui/icons';
import {Divider, Flex, Icon, Text, Stack} from "@chakra-ui/react";

interface NavDecksProps {
    url: string
}

export const NavDecks: React.FC<NavDecksProps> = ({url}) => {
    const [clicked, setClicked] = useState<'decks-home' | 'progress' | 'folders'>('decks-home');

    useMemo(() => {
        if(window.location.pathname.includes('folders')) {
            setClicked('folders')
        } else if(window.location.pathname.includes('progress')) {
            setClicked('progress')
        } else {
            setClicked('decks-home')
        }
    }, [window.location.pathname])

    return (
        <Stack spacing={[7,5,5,5]}>
            <NextLink href={`${url}/home`}>
                <NavItemProfile
                    id="decks-home"
                    clicked={clicked}
                    icon={CloseIcon}
                >
                    Home
                </NavItemProfile>
            </NextLink>
            <NextLink href={`${url}/progress`}>
                <NavItemProfile
                    id="progress"
                    clicked={clicked}
                    icon={CloseIcon}
                >
                    Progress
                </NavItemProfile>
            </NextLink>
            <NextLink href={`${url}/folders`}>
                <NavItemProfile
                    id="folders"
                    clicked={clicked}
                    icon={CloseIcon}
                >
                    Folders
                </NavItemProfile>
            </NextLink>
            <Divider/>
            <NextLink href="/">
                <Flex
                    alignItems="center"
                    direction="row"
                    paddingLeft={[5,5,10,10]}
                >
                    <Icon as={CloseIcon} boxSize={5}/>
                    <Text
                        fontSize="lg"
                        fontWeight="600"
                        ml={2}
                    >
                        Languages
                    </Text>
                </Flex>
            </NextLink>
        </Stack>
    );
}