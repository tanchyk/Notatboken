import React, {useMemo, useState} from "react";
import NextLink from "next/link";
import {NavItemProfile} from "./NavItemProfile";
import {FaRegFolderOpen} from "react-icons/fa";
import {GiProgression} from "react-icons/gi";
import {IoLanguageOutline} from "react-icons/io5";
import {RiHome4Line} from "react-icons/ri";
import {Divider, Flex, Icon, Text, Stack} from "@chakra-ui/react";
import {useRouter} from "next/router";

interface NavDecksProps {
    url: string
}

export const NavDecks: React.FC<NavDecksProps> = ({url}) => {
    const router = useRouter();
    const path = router.pathname;
    const [clicked, setClicked] = useState<'decks-home' | 'progress' | 'folders'>('decks-home');

    useMemo(() => {
        if(path.includes('folders')) {
            setClicked('folders')
        } else if(path.includes('progress')) {
            setClicked('progress')
        } else {
            setClicked('decks-home')
        }
    }, [path])

    return (
        <Stack spacing={[7,5,5,5]}>
            <NextLink href={`${url}/home`}>
                <NavItemProfile
                    id="decks-home"
                    clicked={clicked}
                    icon={RiHome4Line}
                >
                    Home
                </NavItemProfile>
            </NextLink>
            <NextLink href={`${url}/progress`}>
                <NavItemProfile
                    id="progress"
                    clicked={clicked}
                    icon={GiProgression}
                >
                    Progress
                </NavItemProfile>
            </NextLink>
            <NextLink href={`${url}/folders`}>
                <NavItemProfile
                    id="folders"
                    clicked={clicked}
                    icon={FaRegFolderOpen}
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
                    <Icon as={IoLanguageOutline} boxSize={5}/>
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