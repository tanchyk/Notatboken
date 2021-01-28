import React, { useState} from "react";
import {Flex, Stack, Box, useStyleConfig} from "@chakra-ui/react";
import {Wrapper} from "../components/wrappers/Wrapper";
import {DeleteAccount} from "../components/profile/DeleteAccount";
import {Link as LinkPage, Redirect, Route, Switch, useRouteMatch} from "react-router-dom";
import {BasicInformation} from "../components/profile/BasicInformation";
import {ChangePassword} from "../components/profile/ChangePassword";
import {NavItem} from "../components/profile/NavItem";

export const ProfilePage: React.FC<{}> = ({}) => {
    const styleStack = useStyleConfig("Stack");
    const match = useRouteMatch();

    const [clicked, setClicked] = useState<'basic' | 'change-p' | 'delete'>('basic');
    const handleClick = (event: React.MouseEvent<HTMLParagraphElement>) => setClicked(event.currentTarget.id as 'basic' | 'change-p' | 'delete');

    return (
        <Flex justifyContent="center">
            <Wrapper variant='small'>
                <Stack
                    sx={styleStack}
                    w={["100%", "90%", "40%", "30%"]}
                    paddingTop={8}
                    paddingBottom={8}
                    marginTop={["0px", "0px", "30px", "30px"]}
                    spacing={8}
                    maxH="188.4px"
                >
                    <LinkPage to={`${match.url}/basic-information`}>
                        <NavItem
                            id="basic"
                            handleClick={handleClick}
                            clicked={clicked}
                        >
                            Basic Information
                        </NavItem>
                    </LinkPage>
                    <LinkPage to={`${match.url}/change-password`}>
                        <NavItem
                            id="change-p"
                            handleClick={handleClick}
                            clicked={clicked}
                        >
                            Change Password
                        </NavItem>
                    </LinkPage>
                    <LinkPage to={`${match.url}/delete-account`}>
                        <NavItem
                            id="delete"
                            handleClick={handleClick}
                            clicked={clicked}
                        >
                            Delete Account
                        </NavItem>
                    </LinkPage>
                </Stack>
                <Box w={["100%", "90%", "55%", "66%"]}>
                    <Switch>
                        <Route path={`${match.url}/basic-information`} component={BasicInformation}/>
                        <Route path={`${match.url}/change-password`} component={ChangePassword}/>
                        <Route path={`${match.url}/delete-account`} component={DeleteAccount}/>
                        <Redirect to={`${match.url}/basic-information`}/>
                    </Switch>
                </Box>
            </Wrapper>
        </Flex>
    );
}