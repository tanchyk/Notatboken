import React from "react";
import {Flex, Stack, Box, useStyleConfig} from "@chakra-ui/react";
import {Wrapper} from "../../components/wrappers/Wrapper";
import {DeleteAccount} from "../../components/profile/DeleteAccount";
import {Redirect, Route, Switch, useRouteMatch} from "react-router-dom";
import {BasicInformation} from "../../components/profile/BasicInformation";
import {ChangePassword} from "../../components/profile/ChangePassword";
import {UserGoal} from "../../components/profile/UserGoal";
import {NavbarProfile} from "../../components/profile/navigation/NavbarProfile";

export const ProfilePage: React.FC<{}> = ({}) => {
    const styleStack = useStyleConfig("Stack");
    const match = useRouteMatch();

    return (
        <Flex justifyContent="center">
            <Wrapper variant='small'>
                <Stack
                    sx={styleStack}
                    w={["100%", "100%", "35%", "35%", "35%", "27%"]}
                    display={["none", "none", "flex", "flex", "flex", "flex"]}
                    paddingTop={8}
                    paddingBottom={8}
                    marginTop={8}
                    maxH="241.2px"
                >
                    <NavbarProfile url={match.url} />
                </Stack>
                <Box w={["100%", "100%", "60%", "60%", "60%", "70%"]}>
                    <Switch>
                        <Route path={`${match.url}/basic-information`} component={BasicInformation}/>
                        <Route path={`${match.url}/goal`} component={UserGoal}/>
                        <Route path={`${match.url}/change-password`} component={ChangePassword}/>
                        <Route path={`${match.url}/delete-account`} component={DeleteAccount}/>
                        <Redirect to={`${match.url}/basic-information`}/>
                    </Switch>
                </Box>
            </Wrapper>
        </Flex>
    );
}