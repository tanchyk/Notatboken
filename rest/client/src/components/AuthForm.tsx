import React, {ReactElement, useEffect, useState} from "react";
import {LoginData, RegisterData, FieldProps} from "../utils/types";
import {Field, Form, Formik} from "formik";
import {
    Button,
    Link,
    Stack,
    IconButton,
    Tooltip
} from "@chakra-ui/react";
import {Link as LinkPage} from "react-router-dom";
import {useSelector} from "react-redux";
import {userError, userStatus} from "../store/userSlice";
import {SerializedError} from "@reduxjs/toolkit";
import {validateEmail, validatePassword, validateUsername, validateUsernameOrEmail} from "../utils/validationFunctions";
import {PasswordInput} from "./inputs/PasswordInput";
import {UserInput} from "./inputs/UserInput";
import {AuthWrapper} from "./wrappers/AuthWrapper";
import {AiFillUnlock} from "react-icons/all";

//Page props
interface AuthFormProps {
    action: string,
    actionHandler: (values: any) => Promise<void>
}

//Auth form
export const AuthForm: React.FC<AuthFormProps> = ({action, actionHandler}) => {
    //Data
    const [message, setMessage] = useState<string | null | SerializedError>(null);

    const status = useSelector(userStatus);
    const errorMessage = useSelector(userError);

    useEffect(() => {
        if(status === 'failed' && errorMessage.type === action) {
            setMessage(errorMessage.message);
        }
    }, [status, errorMessage]);

    let initialState = {};
    let authForm: ReactElement;

    if(action === 'login') {
        initialState = {usernameOrEmail: "", password: ""} as LoginData;

        authForm = (
            <Field name="usernameOrEmail" validate={validateUsernameOrEmail}>
                {({field, form}: FieldProps) => (
                    <UserInput
                        size="md"
                        name="usernameOrEmail"
                        placeholder="Email or Username"
                        message={message}
                        field={field}
                        form={form}
                    />
                )}
            </Field>
        )
    } else if(action === 'register') {
        initialState = {username: "", email: "", password: ""} as RegisterData;

        authForm = (
            <Stack spacing={5}>
                <Field name="username" validate={validateUsername}>
                    {({field, form}: FieldProps) => (
                        <UserInput
                            size="md"
                            name="username"
                            placeholder="Enter username"
                            message={message}
                            field={field}
                            form={form}
                        />
                    )}
                </Field>
                <Field name="email" validate={validateEmail}>
                    {({field, form}: FieldProps) => (
                        <UserInput
                            size="md"
                            name="email"
                            placeholder="Enter email"
                            field={field}
                            form={form}
                        />
                    )}
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
                    <AuthWrapper
                        page={action === "login" ? "Login":"Sign up"}
                        src={action === "login" ?
                            "https://res.cloudinary.com/dw3hb6ec8/image/upload/v1614424865/mainpage/login_f0ccax.png" :
                            "https://res.cloudinary.com/dw3hb6ec8/image/upload/v1614424866/mainpage/register_aamjpe.png"}
                        to={`/${action === 'login' ? 'register' : 'login'}`}
                        text={action === 'login' ? 'If you dont have account yet, sign up ' : 'If you have an account, login '}
                    >
                        {authForm}
                        <Field name="password" validate={validatePassword}>
                            {({field, form}: FieldProps) => (
                                <PasswordInput
                                    size="md"
                                    name="password"
                                    placeholder="Enter password"
                                    field={field}
                                    form={form}
                                />
                            )}
                        </Field>
                        <Stack spacing={2} direction="row" alignItems="center">
                            <Button
                                width="120px"
                                type="submit"
                            >
                                {action === 'login' ? 'Login' : 'Sign up'}
                            </Button>
                            {
                                action === 'login' ? (
                                    <Tooltip label="Forgot Password">
                                        <LinkPage to="/forgot-password">
                                            <IconButton aria-label="forgot-password" icon={<AiFillUnlock/>}/>
                                        </LinkPage>
                                    </Tooltip>
                                ) : null
                            }
                            <Link color="blue.500" href="/" pl={3}>
                                <LinkPage to="/">
                                    Home
                                </LinkPage>
                            </Link>
                        </Stack>
                    </AuthWrapper>
                </Form>
            )}
        </Formik>
    );
}