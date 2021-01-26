import React, {ReactElement, useEffect, useState} from "react";
import {LoginData, RegisterData, FieldProps} from "../utils/types";
import {Field, Form, Formik} from "formik";
import {
    Box, Button,
    FormControl,
    FormErrorMessage,
    Heading,
    Image,
    Input,
    InputGroup,
    InputRightElement,
    Link,
    Stack, useStyleConfig
} from "@chakra-ui/react";
import {ExternalLinkIcon} from "@chakra-ui/icons";
import {Link as LinkPage} from "react-router-dom";
import {useSelector} from "react-redux";
import {userData, userError, userStatus} from "../store/userSlice";
import store from "../store/store";
import {history} from "../App";
import {SerializedError} from "@reduxjs/toolkit";
import {validateEmail, validatePassword, validateUsername, validateUsernameOrEmail} from "../utils/validationFunctions";

//Page props
interface AuthFormProps {
    action: string,
    actionHandler: (values: any) => Promise<void>
}

//Auth form
export const AuthForm: React.FC<AuthFormProps> = ({action, actionHandler}) => {
    const styleStack = useStyleConfig("Stack");
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);

    //Data
    const [message, setMessage] = useState<string | null | SerializedError>(null);

    const user = useSelector(userData);
    const status = useSelector(userStatus);
    const errorMessage = useSelector(userError);

    useEffect(() => {
        console.log(store.getState());
        if(status === 'succeeded') {
            history.push('/notes');
        } else  if(status === 'failed' && errorMessage.message && errorMessage.type === action) {
            setMessage(errorMessage.message);
        }
    }, [user, errorMessage]);

    let initialState = {};
    let authForm: ReactElement;

    if(action === 'login') {
        initialState = {usernameOrEmail: "", password: ""} as LoginData;

        authForm = (
            <Field name="usernameOrEmail" validate={validateUsernameOrEmail}>
                {({field, form}: FieldProps) => {
                    if (message) {
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
                                isInvalid={!!form.errors.usernameOrEmail && !!form.touched.usernameOrEmail}>
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
        )
    } else if(action === 'register') {
        initialState = {username: "", email: "", password: ""} as RegisterData;

        authForm = (
            <Stack spacing={5}>
                <Field name="username" validate={validateUsername}>
                    {({field, form}: FieldProps) => {
                        if (message) {
                            return (
                                <FormControl
                                    isInvalid={!!message}>
                                    <Input
                                        {...field}
                                        variant="outline"
                                        placeholder="Enter username"
                                        id="username"
                                    />
                                    <FormErrorMessage>{message}</FormErrorMessage>
                                </FormControl>
                            )
                        } else {
                            return (
                                <FormControl
                                    isInvalid={!!form.errors.username && !!form.touched.username}>
                                    <Input
                                        {...field}
                                        variant="outline"
                                        placeholder="Enter username"
                                        id="username"
                                    />
                                    <FormErrorMessage>{form.errors.username}</FormErrorMessage>
                                </FormControl>
                            )
                        }
                    }}
                </Field>
                <Field name="email" validate={validateEmail}>
                    {({field, form}: FieldProps) => (
                        <FormControl
                            isInvalid={!!form.errors.email && !!form.touched.email}>
                            <Input
                                {...field}
                                variant="outline"
                                placeholder="Enter email"
                                id="email"
                            />
                            <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                        </FormControl>
                    )
                    }
                </Field>
            </Stack>
        );
    }

    return (
        <Formik
            initialValues={initialState}
            onSubmit={async (values) => {
                await actionHandler(values);
            }}
        >
            {() => (
                <Form>
                    <Stack
                        sx={styleStack}
                        borderLeftWidth="4px"
                        maxW={["100%", "90%", "70%", "50%"]}
                        padding="20px"
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
                                <LinkPage to={`/${action === 'login' ? 'register' : 'login'}`}>
                                    <Link>
                                        {action === 'login' ? 'If you dont have account yet, sign up ' : 'If you have an account, log in '}
                                        <ExternalLinkIcon mx="2px"/>
                                    </Link>
                                </LinkPage>
                            </Stack>
                            <Stack spacing={5}>
                                <Heading as="h1" size="xl">
                                    {action === 'login' ? 'Login' : 'Sign up'}
                                </Heading>
                                {authForm}
                                <InputGroup size="md">
                                    <Field name="password" validate={validatePassword}>
                                        {({field, form}: FieldProps) => (
                                            <FormControl isInvalid={!!form.errors.password && !!form.touched.password}>
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
                                        variantсolor='teal'
                                    >
                                        {action === 'login' ? 'Login' : 'Sign up'}
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