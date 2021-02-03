import React, {ReactElement, useEffect, useState} from "react";
import {LoginData, RegisterData, FieldProps} from "../utils/types";
import {Field, Form, Formik} from "formik";
import {
    Box, Button,
    Heading,
    Image,
    Link,
    Stack, useStyleConfig
} from "@chakra-ui/react";
import {ExternalLinkIcon} from "@chakra-ui/icons";
import {Link as LinkPage} from "react-router-dom";
import {useSelector} from "react-redux";
import {userData, userError, userStatus} from "../store/userSlice";
import {history} from "../App";
import {SerializedError} from "@reduxjs/toolkit";
import {validateEmail, validatePassword, validateUsername, validateUsernameOrEmail} from "../utils/validationFunctions";
import {PasswordInput} from "./inputs/PasswordInput";
import {UserInput} from "./inputs/UserInput";

//Page props
interface AuthFormProps {
    action: string,
    actionHandler: (values: any) => Promise<void>
}

//Auth form
export const AuthForm: React.FC<AuthFormProps> = ({action, actionHandler}) => {
    const styleStack = useStyleConfig("Stack");

    //Data
    const [message, setMessage] = useState<string | null | SerializedError>(null);

    const user = useSelector(userData);
    const status = useSelector(userStatus);
    const errorMessage = useSelector(userError);

    useEffect(() => {
        if(status === 'succeeded') {
            history.push('/notes');
        } else if(status === 'failed' && errorMessage.type === action) {
            setMessage(errorMessage.message);
        }
    }, [user, errorMessage]);

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
                                        src={ action === "login" ? "https://lh3.googleusercontent.com/fZBzYoLp2Ea3eLBWaJ5Qqebgv301piTXxJRZvUOJscrTbdKj_wdoe3ljjbrPVWkG9BE8oEUw2iWh2g-RwSIJpsle480PNYPLZdXvzuGevbgVaeud1goS8USoz3io2eNI7T6_kNIoNKNd1lkXQktOdu3EuYpG1v5jwCFh1XyHVc2nlGQUayYe5QxgUNalGqkrHzdepbjsryhzKSO57APSyIosEQmeu45Da3CLwikLkehMhdNp5DQG2TFmiW4QSGoc5UWhCfZoqvKci0t0l1AOkT8wzyjPsUyhug2c1IV0fz6Ncyq6UmBj9XJ3IFtWLmOUJNaBFvZSUq8hwCx8jNPMunKJ_4NpFS7XxUs9xUpzVnslRNb26J9S-ogSf4r2H8Os3KfjFCK9AkOyYublKaQ_kyLoGHopT5qf9VboF_tp2BgOE6_Vs-SLqc9n8BV_2RLrAvyokHYZGecRyATZVbO2b8RJ4kv-nkfupDprfA_0SBrVHwspLqf3O8tTCzD07OaXLEhD5nWWJPiJ_tVt6ggk-VPKoaIvEPO6iC3nok1Z44OR0pipeq-465s3EvaAKZ1yCz1e-RxQLcCLgotGDcqxV6oIvuKOyFR87fYLcBKmAx47TW27o3ToM7enr0nB34yxr3s0TYNWLMyW1jYgnzH4EWN5PhBC3ANCpeuRPeRdWmRqhY_DTFBsLhPmCM4q=s640-no?authuser=0" : "https://lh3.googleusercontent.com/9sot2TLaiJZwhauamDy0EX_Nl3K_oucAexZBhFrBiYXp1AR-n6qadO9OG14DXT_hRzJSIKPPVwsjdqF3XEWoKWyhaASzYeUvG2haxh2G6s9Vmm_h809uuj8sD1H5WngRIDMxwtRAO49z07t4HNOBn48OhU4P8RGHFG5TUDmxEZfiMQ-i3ekHDe-iHiOsD2zNXdYM99IND8olO1Gif91TDna30S_vXpVXm5_fqGwISiw9IcyrXfTTblMI89WtBrJlYd-l3V4215yb-q2l_N9xLA5LU4ehOu2cpu7y8k8ydbXivGaR3Ktg2Upl4gTuNSYMPRgtNoH9SlWIorbAlgSVMUwUFMMKK6aXmuf-vdUXK1N9v2XaIf0Ob8184-gsAe4D06MC5gb80yzIEv7NtRhhdY1MXsXrGstt2K42ukqaKDNI20_rx9WbX3XInWoIRLykUrn83Sdzu6u-q_6SfbdmbRlM0uJm9Uz5mw356rH3NlJILmB8jAaoAaCumf60wRd5v_CPbFJ75Q-ajInLXR2vd8_vgSPQP6P5naPK8Du9VGJ3kwXIveN11gFkqiOHfG3GWCkUbqF6mj1eUxwO8KLYAEPExUsr40iQTjHfJmkEoZ2iqCDkAY6f1EJ-Iy6ZjIIG9Q5dji-BTQfqeT9IM61Av911RiucIMzoqbvKEPaZugHzKaCI2ts1sMSZ56Ua=s640-no?authuser=0"}
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