import React, {useMemo, useState} from 'react';
import NextLink from "next/link";
import {NavItemProfile} from "./NavItemProfile";
import {Stack} from "@chakra-ui/react";
import {useRouter} from "next/router";

export const NavProfile: React.FC = ({}) => {
    const router = useRouter();
    const path = router.pathname;
    const [clicked, setClicked] = useState<'basic' | 'change-p' | 'delete' | 'goal'>('basic');

    useMemo(() => {
        if(path.includes('change-password')) {
            setClicked('change-p')
        } else if(path.includes('delete-account')) {
            setClicked('delete')
        } else if(path.includes('goal')) {
            setClicked('goal')
        } else {
            setClicked('basic')
        }
    }, [path])

    return (
        <Stack spacing={8}>
            <NextLink href="/account/basic-information">
                <NavItemProfile
                    id="basic"
                    clicked={clicked}
                >
                    Basic Information
                </NavItemProfile>
            </NextLink>
            <NextLink href="/account/goal">
                <NavItemProfile
                    id="goal"
                    clicked={clicked}
                >
                    Set User Goal
                </NavItemProfile>
            </NextLink>
            <NextLink href="/account/change-password">
                <NavItemProfile
                    id="change-p"
                    clicked={clicked}
                >
                    Change Password
                </NavItemProfile>
            </NextLink>
            <NextLink href="/account/delete-account">
                <NavItemProfile
                    id="delete"
                    clicked={clicked}
                >
                    Delete Account
                </NavItemProfile>
            </NextLink>
        </Stack>
    );
}