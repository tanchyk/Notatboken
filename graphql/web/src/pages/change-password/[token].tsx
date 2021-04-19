import React from "react";
import {NextPage} from "next";
import {Field, FieldProps, Form, Formik} from "formik";
import {Box, Button, Text, useToast} from "@chakra-ui/react";
import {withApollo} from "../../utils/withApollo"
import { AuthWrapper } from "../../components/wrappers/AuthWrapper";
import { validatePassword } from "../../utils/validationFunctions";
import { PasswordInput } from "../../components/inputs/PasswordInput";
import {useResetPasswordMutation} from "../../generated/graphql";
import {useRouter} from "next/router";

interface ChangePasswordProps {
    token: string;
}

const ChangePassword: NextPage<ChangePasswordProps> = ({token}) => {
    const router = useRouter();
    const toast = useToast();
    const [resetPassword, {loading}] = useResetPasswordMutation();

    return (
        <Formik
            initialValues={{
                newPassword: '',
                confirmPassword: ''
            }}
            onSubmit={async (values, {setFieldError}) => {
                if(values.newPassword !== values.confirmPassword) {
                    setFieldError('newPassword', "Passwords don't match");
                } else {
                    const response = await resetPassword({variables: {token, password: values.newPassword}});

                    if(response.data?.resetPassword.errors) {
                        toast({
                            position: 'bottom',
                            title: "Error.",
                            description: response.data?.resetPassword.errors[0].message,
                            status: "error",
                            duration: 9000,
                            isClosable: true,
                        });
                    } else if(response.data?.resetPassword.confirmed) {
                        toast({
                            position: 'bottom',
                            title: "Changed!",
                            description: "Your password is changed, you can login now",
                            status: "success",
                            duration: 9000,
                            isClosable: true,
                        });
                        await router.push('/login');
                    }
                }
            }}
        >
            {() => (
                <Form>
                    <AuthWrapper
                        page="Change Password"
                        src="https://res.cloudinary.com/dw3hb6ec8/image/upload/v1614425565/mainpage/change_password_mr16nb.png"
                        to="/register"
                        text="If you dont have account yet, sign up"
                    >
                        <Box>
                            <Text fontSize="lg" marginBottom={3} fontWeight="bold">New Password</Text>
                            <Field name="newPassword" validate={validatePassword}>
                                {({field, form}: FieldProps) => (
                                    <PasswordInput
                                        size="lg"
                                        name="newPassword"
                                        placeholder="Enter new password"
                                        field={field}
                                        form={form}
                                    />
                                )}
                            </Field>
                        </Box>
                        <Box>
                            <Text fontSize="lg" marginBottom={3} fontWeight="bold">Confirm New Password</Text>
                            <Field name="confirmPassword" validate={validatePassword}>
                                {({field, form}: FieldProps) => (
                                    <PasswordInput
                                        size="lg"
                                        name="confirmPassword"
                                        placeholder="Confirm new password"
                                        field={field}
                                        form={form}
                                    />
                                )}
                            </Field>
                        </Box>
                        <Button
                            width="150px"
                            type="submit"
                            size="lg"
                            isLoading={loading}
                        >
                            Change Password
                        </Button>
                    </AuthWrapper>
                </Form>
            )}
        </Formik>
    );
}

ChangePassword.getInitialProps = ({query}) => {
    return {
        token: query.token as string
    }
}

// @ts-ignore
export default withApollo({ssr: false})(ChangePassword);