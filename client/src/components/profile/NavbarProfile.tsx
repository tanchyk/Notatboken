import React, {useMemo, useState} from 'react';
import {Link as LinkPage} from "react-router-dom";
import {NavItemProfile} from "./NavItemProfile";
import {Stack} from "@chakra-ui/react";

interface NavbarProfileProps {
    url: string;
}

export const NavbarProfile: React.FC<NavbarProfileProps> = ({url}) => {
    const [clicked, setClicked] = useState<'basic' | 'change-p' | 'delete' | 'goal'>('basic');

    useMemo(() => {
        if(window.location.pathname.includes('change-password')) {
            setClicked('change-p')
        } else if(window.location.pathname.includes('delete-account')) {
            setClicked('delete')
        } else if(window.location.pathname.includes('goal')) {
            setClicked('goal')
        } else {
            setClicked('basic')
        }
    }, [window.location.pathname])

    return (
        <Stack spacing={8}>
            <LinkPage to={`${url}/basic-information`}>
                <NavItemProfile
                    id="basic"
                    clicked={clicked}
                >
                    Basic Information
                </NavItemProfile>
            </LinkPage>
            <LinkPage to={`${url}/goal`}>
                <NavItemProfile
                    id="goal"
                    clicked={clicked}
                >
                    Set User Goal
                </NavItemProfile>
            </LinkPage>
            <LinkPage to={`${url}/change-password`}>
                <NavItemProfile
                    id="change-p"
                    clicked={clicked}
                >
                    Change Password
                </NavItemProfile>
            </LinkPage>
            <LinkPage to={`${url}/delete-account`}>
                <NavItemProfile
                    id="delete"
                    clicked={clicked}
                >
                    Delete Account
                </NavItemProfile>
            </LinkPage>
        </Stack>
    );
}