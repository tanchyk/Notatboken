import React from "react";
import {Field, Form, Formik, FieldProps} from "formik";
import {Box, Button, IconButton, Link, Stack, Tooltip, useToast} from "@chakra-ui/react";
import {validateEmail} from "../utils/validationFunctions";
import {UserInput} from "../components/inputs/UserInput";
import {AuthWrapper} from "../components/wrappers/AuthWrapper";
import NextLink from "next/link";
import {RiLightbulbLine} from "react-icons/ri";
import {useRouter} from "next/router";
import {useForgotPasswordMutation} from "../generated/graphql";
import {toErrorMap} from "../utils/toErrorMap";
import {withApollo} from "../utils/withApollo";

const ForgotPassword: React.FC = () => {
    const router = useRouter();
    const toast = useToast();
    const [forgotPassword, {loading}] = useForgotPasswordMutation();

    return (
        <Formik
            initialValues={{
                email: ''
            }}
            onSubmit={async (values, {setErrors}) => {
                const response = await forgotPassword({
                    variables: {email: values.email}
                });

                if(response.data?.forgotPassword.errors) {
                    return setErrors(toErrorMap(response.data?.forgotPassword.errors));
                } else if(response.data?.forgotPassword.send === true) {
                    toast({
                        position: 'bottom',
                        title: "Email is sent.",
                        description: "Check your email for confirmation message.",
                        status: "success",
                        duration: 9000,
                        isClosable: true,
                    });
                    return router.push('/');
                }
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
                                isLoading={loading}
                            >
                                Send Email
                            </Button>
                            <Tooltip label="Back to login">
                                <NextLink href="/login">
                                    <IconButton aria-label="login" icon={<RiLightbulbLine/>}/>
                                </NextLink>
                            </Tooltip>
                            <Link color="blue.500" href="/" pl={3}>
                                <NextLink href="/">
                                    Home
                                </NextLink>
                            </Link>
                        </Stack>
                    </AuthWrapper>
                </Form>
            )}
        </Formik>
    );
}

export default withApollo({ssr: false})(ForgotPassword);