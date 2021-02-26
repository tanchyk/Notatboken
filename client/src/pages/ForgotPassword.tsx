import React, {useEffect} from "react";
import {Field, Form, Formik} from "formik";
import {Box, Button, Heading, Image, Link, Stack, Text, useToast} from "@chakra-ui/react";
import {validateEmail} from "../utils/validationFunctions";
import {FieldProps} from "../utils/types";
import {UserInput} from "../components/inputs/UserInput";
import {AuthWrapper} from "../components/wrappers/AuthWrapper";
import {Link as LinkPage} from "react-router-dom";
import {ExternalLinkIcon} from "@chakra-ui/icons";
import {history} from "../App";
import {useDispatch, useSelector} from "react-redux";
import {requestChangePassword, userError} from "../store/userSlice";
import {AppDispatch} from "../store/store";

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
                    <AuthWrapper>
                        <Box boxSize={["sm", "sm", "sm", "md"]}>
                            <Image
                                src="https://res.cloudinary.com/dw3hb6ec8/image/upload/v1614356300/notatboken/send-email_zzsha9.png"
                            />
                        </Box>
                        <Stack spacing={5}>
                            <Heading as="h1" size="xl">
                                Forgot Password
                            </Heading>
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
                            <Stack spacing={5} direction="row" alignItems="center">
                                <Button
                                    width="120px"
                                    type="submit"
                                >
                                    Send Email
                                </Button>
                                <Link color="blue.500" href="/">
                                    <LinkPage to="/">
                                        Home
                                    </LinkPage>
                                </Link>
                            </Stack>
                            <LinkPage to="/login">
                                <Link>
                                    Back to login page
                                    <ExternalLinkIcon mx="2px"/>
                                </Link>
                            </LinkPage>
                        </Stack>
                    </AuthWrapper>
                </Form>
            )}
        </Formik>
    );
}