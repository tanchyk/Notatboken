import React from "react";
import {Avatar, Menu, MenuButton, MenuDivider, MenuItem, MenuList} from "@chakra-ui/react";
import NextLink from 'next/link';
import {FaUser} from "react-icons/fa";
import {IoLanguageOutline} from "react-icons/io5";
import {MdExitToApp} from "react-icons/md";
import {BiStats} from "react-icons/bi";
import {useMeQuery} from "../../generated/graphql";

interface UserIconProps {
    logoutHandler: () => void;
}

export const UserIcon: React.FC<UserIconProps> = ({logoutHandler}) => {
    const {data} = useMeQuery();

    if(!data || !data.me) {
        return <></>;
    }

    return (
        <Menu placement="bottom-end">
            <MenuButton
                size="md"
                variant="outline"
                borderRadius="full"
            >
                <Avatar size="md" name={data.me.username!} src={data.me.avatar!} />
            </MenuButton>
            <MenuList w="260px">
                <NextLink href="/profile">
                    <MenuItem icon={<FaUser/>}>
                        Profile
                    </MenuItem>
                </NextLink>
                <NextLink href="/statistics">
                    <MenuItem icon={<IoLanguageOutline/>}>
                        Statistics
                    </MenuItem>
                </NextLink>
                <NextLink href="/">
                    <MenuItem icon={<MdExitToApp/>}>
                        Languages
                    </MenuItem>
                </NextLink>
                <MenuDivider/>
                <MenuItem icon={<BiStats />} onClick={logoutHandler}>
                    Log out
                </MenuItem>
            </MenuList>
        </Menu>
    );
}