import React from "react";
import {Avatar, Menu, MenuButton, MenuDivider, MenuItem, MenuList} from "@chakra-ui/react";
import {Link as LinkPage} from "react-router-dom";
import {FaUser, IoLanguageOutline, MdExitToApp, BiStats} from "react-icons/all";
import {useSelector} from "react-redux";
import {userData} from "../../store/userSlice";

interface UserIconProps {
    logoutHandler: () => void;
}

export const UserIcon: React.FC<UserIconProps> = ({logoutHandler}) => {
    const user = useSelector(userData);

    return (
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
                <LinkPage to="/statistics">
                    <MenuItem icon={<BiStats/>}>
                        Statistics
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
    );
}