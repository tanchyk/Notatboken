import React, {useEffect, useState} from 'react';
import {Box, Button, Heading, Image, Input, InputGroup, InputRightElement, Link, Stack} from "@chakra-ui/react";
import {ExternalLinkIcon} from '@chakra-ui/icons';
import {
    Link as LinkPage
} from "react-router-dom";
import {LoginData} from "../utils/types";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../store/store";
import {fetchUser, userData, userStatus} from "../store/userSlice";
import {history} from '../App';
import {useLogin} from "../utils/login.hook";

const LoginPage: React.FC<{}> = () => {
    const [inputData, setInputData] = useState<LoginData>({
        usernameOrEmail: '',
        password: ''
    });
    const dispatch = useDispatch<AppDispatch>();
    const {login} = useLogin();

    const user = useSelector(userData);
    const status = useSelector(userStatus);

    useEffect(() => {
        if(status === 'succeeded') {
            login(user.userId);
            history.push('/');
        }
    }, [status]);

    const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputData({...inputData, [event.target.id]: event.target.value});
    }

    const loginHandler = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if(inputData.usernameOrEmail.includes('@')) {
            const testEmail = /\S+@\S+\.\S+/;
            if(!testEmail.test(inputData.usernameOrEmail)) {
                return;
            }
        } else {
            const testUsername = /\w/;
            if(!testUsername.test(inputData.usernameOrEmail)) {
                return;
            }
        }

        const testPassword = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}/;
        if(!testPassword.test(inputData.password)) {
            return;
        }

        await dispatch(fetchUser(inputData));
    }

    const [show, setShow] = React.useState(false);
    const handleClick = () => setShow(!show);

    return (
        <Stack
            maxW={["100%", "90%", "70%", "50%"]}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            padding="20px"
            backgroundColor="#fff"
            margin="auto"
            marginTop={["10px", "20px", "40px", "100px"]}
        >
            <Stack
                direction="row"
                wrap="wrap"
                alignItems="center"
                justifyContent="center"
            >
                <Stack spacing={5} textAlign="center">
                    <Box boxSize={["sm", "sm", "sm", "md"]}>
                        <Image
                            src="https://image.freepik.com/vecteurs-libre/ordinateur-portable-smartphone-casque-cartoon-icon-illustration-concept-icone-technologie-entreprise-isole-style-bande-dessinee-plat_138676-2139.jpg"
                        />
                    </Box>
                    <Link href="https://chakra-ui.com" isExternal>
                        If you dont have account yet, register <ExternalLinkIcon mx="2px" />
                    </Link>
                </Stack>
                <Stack spacing={5}>
                    <Heading as="h1" size="xl">
                        Login
                    </Heading>

                    <Input
                        variant="outline"
                        placeholder="Email or Username"
                        id="usernameOrEmail"
                        onChange={changeHandler}
                    />
                    <InputGroup size="md">
                        <Input
                            id="password"
                            pr="4.5rem"
                            type={show ? "text" : "password"}
                            placeholder="Enter password"
                            onChange={changeHandler}
                        />
                        <InputRightElement width="4.5rem">
                            <Button h="1.75rem" size="sm" onClick={handleClick}>
                                {show ? "Hide" : "Show"}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                    <Stack spacing={5} direction="row" alignItems="center">
                        <Button
                            width="120px"
                            type="submit"
                            variantColor={'teal'}
                            onClick={loginHandler}
                        >
                            Login
                        </Button>
                        <Link color="blue.500" href="/">
                            <LinkPage to="/">
                                Home
                            </LinkPage>
                        </Link>
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    );
}

export default LoginPage;
