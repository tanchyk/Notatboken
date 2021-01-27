import React, {useState} from "react";
import {Flex, Stack, Text, Box, useStyleConfig} from "@chakra-ui/react";
import {Wrapper} from "../components/wrappers/Wrapper";
import {DeleteAccount} from "../components/profile/DeleteAccount";
import {Link as LinkPage, Redirect, Route, Switch, useRouteMatch} from "react-router-dom";
import {BasicInformation} from "../components/profile/BasicInformation";
import {ChangePassword} from "../components/profile/ChangePassword";

export const ProfilePage: React.FC<{}> = ({}) => {
    const [clicked, setClicked] = useState<'basic' | 'change-p' | 'delete'>('basic');
    const styleStack = useStyleConfig("Stack");
    const match = useRouteMatch();

    // @ts-ignore
    const handleClick = (event: React.MouseEvent<HTMLParagraphElement>) => setClicked(event.target.id);

    return (
        <Flex justifyContent="center">
            <Wrapper variant='small'>
                <Stack
                    sx={styleStack}
                    w={["100%", "90%", "40%", "30%"]}
                    padding={8}
                    paddingLeft={10}
                    marginTop={["0px", "0px", "30px", "30px"]}
                    spacing={8}
                    maxH="188.4px"
                >
                    <LinkPage to={`${match.url}/basic-information`}>
                        <Text
                            fontSize="lg"
                            id="basic"
                            onClick={handleClick}
                            fontWeight={clicked === 'basic' ? 'bold' : 'regular'}
                        >
                            Basic Information
                        </Text>
                    </LinkPage>
                    <LinkPage to={`${match.url}/change-password`}>
                        <Text
                            fontSize="lg"
                            id="change-p"
                            onClick={handleClick}
                            fontWeight={clicked === 'change-p' ? 'bold' : 'regular'}
                        >
                            Change Password
                        </Text>
                    </LinkPage>
                    <LinkPage to={`${match.url}/delete-account`}>
                        <Text
                            fontSize="lg"
                            id="delete"
                            onClick={handleClick}
                            fontWeight={clicked === 'delete' ? 'bold' : 'regular'}
                        >
                            Delete Account
                        </Text>
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