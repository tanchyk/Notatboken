import React, {useEffect} from 'react';
import {
    Box,
    Button, FormControl, FormErrorMessage,
    Heading,
    Image,
    Input,
    InputGroup,
    InputRightElement,
    Link,
    Stack
} from "@chakra-ui/react";
import {ExternalLinkIcon} from '@chakra-ui/icons';
import {
    Link as LinkPage
} from "react-router-dom";
import {LoginData} from "../utils/types";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../store/store";
import {fetchUser, userData, userError, userStatus} from "../store/userSlice";
import {history} from '../App';
import {useLogin} from "../utils/login.hook";

import { Formik, Form, Field,  } from "formik";

//Validation functions

const validateUsernameOrEmail = (value: string) => {
    let error;
    const testEmail = /\S+@\S+\.\S+/;
    const testUsername = /\w/;
    if (value.includes('@') && (!testEmail.test(value) || value.length < 8 || value.length > 264)) {
        error = "Please, enter valid Email";
    } else if (!testUsername.test(value) || value.length < 3 || value.length > 64) {
        error = "Please, enter valid Username";
    }
    return error
}

const validatePassword = (value: string) => {
    let error;
    const testPassword = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}/;
    if (!testPassword.test(value)) {
        error = "Please, enter valid password";
    }
    return error
}


//Page component
const LoginPage: React.FC<{}> = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {login} = useLogin();

    const user = useSelector(userData);
    const status = useSelector(userStatus);
    const errorMessage = useSelector(userError);
    let message: string | null | undefined = null;

    useEffect(() => {
        if(status === 'succeeded') {
            login(user.userId);
            history.push('/');
        } else  if(status === 'failed' && errorMessage) {
            message = errorMessage.message;
        }
    }, [user, errorMessage]);

    const loginHandler = async (values: LoginData) => {
        await dispatch(fetchUser(values));
    }

    const [show, setShow] = React.useState(false);
    const handleClick = () => setShow(!show);

    return (
        <Formik
            initialValues={{usernameOrEmail: "", password: ""} as LoginData}
            onSubmit={async (values) => {
                await loginHandler(values)
            }}
        >
            {(props) => (
                <Form>
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
                                    If you dont have account yet, register <ExternalLinkIcon mx="2px"/>
                                </Link>
                            </Stack>
                            <Stack spacing={5}>
                                <Heading as="h1" size="xl">
                                    Login
                                </Heading>
                                <Field name="usernameOrEmail" validate={validateUsernameOrEmail}>
                                    {({field, form}) => {
                                        if(message) {
                                            return (
                                                <FormControl
                                                    isInvalid={!!message}>
                                                    <Input
                                                        {...field}
                                                        variant="outline"
                                                        placeholder="Email or Username"
                                                        id="usernameOrEmail"
                                                    />
                                                    <FormErrorMessage>{message}</FormErrorMessage>
                                                </FormControl>
                                            )
                                        } else {
                                            return (
                                                <FormControl
                                                    isInvalid={form.errors.usernameOrEmail && form.touched.usernameOrEmail}>
                                                    <Input
                                                        {...field}
                                                        variant="outline"
                                                        placeholder="Email or Username"
                                                        id="usernameOrEmail"
                                                    />
                                                    <FormErrorMessage>{form.errors.usernameOrEmail}</FormErrorMessage>
                                                </FormControl>
                                            )
                                        }
                                    }}
                                </Field>
                                <InputGroup size="md">
                                    <Field name="password" validate={validatePassword}>
                                        {({field, form}) => (
                                            <FormControl isInvalid={form.errors.password && form.touched.password}>
                                                <Input
                                                    {...field}
                                                    id="password"
                                                    name="password"
                                                    pr="4.5rem"
                                                    type={show ? "text" : "password"}
                                                    placeholder="Enter password"
                                                />
                                                <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                                            </FormControl>
                                        )}
                                    </Field>
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
                </Form>
            )}
        </Formik>
    );
}

export default LoginPage;
