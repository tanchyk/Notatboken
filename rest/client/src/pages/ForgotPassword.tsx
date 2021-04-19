import React, {useEffect} from "react";
import {Field, Form, Formik} from "formik";
import {Box, Button, IconButton, Link, Stack, Text, Tooltip, useToast} from "@chakra-ui/react";
import {validateEmail} from "../utils/validationFunctions";
import {FieldProps} from "../utils/types";
import {UserInput} from "../components/inputs/UserInput";
import {AuthWrapper} from "../components/wrappers/AuthWrapper";
import {Link as LinkPage} from "react-router-dom";
import {history} from "../App";
import {useDispatch, useSelector} from "react-redux";
import {requestChangePassword, userError} from "../store/userSlice";
import {AppDispatch} from "../store/store";
import {RiLightbulbLine} from "react-icons/all";

export const ForgotPassword: React.FC = () => {
    const toast = useToast();
    const dispatch = useDispatch<AppDispatch>();
    const error = useSelector(userError);

    useEffect(() => {
        if(error.type === 'confirmEmail') {
            toast({
                position: 'bottom',
                title: "Email is sent.",
                description: "Check your email for confirmation message.",
                status: "success",
                duration: 9000,
                isClosable: true,
            });
            history.push('/');
        }
    }, [error])

    return (
        <Formik
            initialValues={{
                email: ''
            }}
            onSubmit={async (values) => {
                await dispatch(requestChangePassword({email: values.email}));
            }}
        >
            {() => (
                <Form>
                    <AuthWrapper
                        page="Forgot Password"
                        src="https://res.cloudinary.com/dw3hb6ec8/image/upload/v1614424748/mainpage/forgot_password_pcnkfd.png"
                        to="/register"
                        text="If you dont have account yet, sign up"
                    >
                        <Box>
                            <Text fontSize="lg" marginBottom={3} fontWeight="bold">Email</Text>
                            <Field name="email" validate={validateEmail}>
                                {({field, form}: FieldProps) => (
                                    <UserInput
                                        size="lg"
                                        name="email"
                                        placeholder="Enter your Email"
                                        field={field}
                                        form={form}
                                    />
                                )}
                            </Field>
                        </Box>
                        <Stack spacing={2} direction="row" alignItems="center">
                            <Button
                                width="120px"
                                type="submit"
                            >
                                Send Email
                            </Button>
                            <Tooltip label="Back to login">
                                <LinkPage to="/login">
                                    <IconButton aria-label="login" icon={<RiLightbulbLine/>}/>
                                </LinkPage>
                            </Tooltip>
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