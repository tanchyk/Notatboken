import React, {useMemo, useState} from "react";
import {Link as LinkPage} from "react-router-dom";
import {NavItemProfile} from "../profile/navigation/NavItemProfile";
import {FaRegFolderOpen, GiProgression, IoLanguageOutline, RiHome4Line} from "react-icons/all";
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
            <LinkPage to={`${url}/home`}>
                <NavItemProfile
                    id="decks-home"
                    clicked={clicked}
                    icon={RiHome4Line}
                >
                    Home
                </NavItemProfile>
            </LinkPage>
            <LinkPage to={`${url}/progress`}>
                <NavItemProfile
                    id="progress"
                    clicked={clicked}
                    icon={GiProgression}
                >
                    Progress
                </NavItemProfile>
            </LinkPage>
            <LinkPage to={`${url}/folders`}>
                <NavItemProfile
                    id="folders"
                    clicked={clicked}
                    icon={FaRegFolderOpen}
                >
                    Folders
                </NavItemProfile>
            </LinkPage>
            <Divider/>
            <LinkPage to="/">
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
            </LinkPage>
        </Stack>
    );
}