import React from 'react';
import {Box, Button, Heading, Image, Stack, Text} from "@chakra-ui/react";
import {Field, Form, Formik} from "formik";
import {validatePassword} from "../utils/validationFunctions";
import {FieldProps} from "../utils/types";
import {PasswordInput} from "../components/inputs/PasswordInput";
import {useRouteMatch} from "react-router-dom";
import {AuthWrapper} from "../components/wrappers/AuthWrapper";
import {useSelector} from "react-redux";
import {csrfData} from "../store/csrfSlice";
import {history} from "../App";

export const ChangeForgotPassword: React.FC = () => {
    const match = useRouteMatch<{token: string}>();
    const token = match.params.token;

    const csrfToken = useSelector(csrfData);

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
                    const response = await fetch('/api/users/change-forgot-password', {
                        method: 'POST',
                        body: JSON.stringify({password: values.newPassword, token}),
                        headers: {
                            'Content-Type': 'application/json',
                            'CSRF-Token': `${csrfToken}`
                        }
                    })
                    if(response.status === 204) {
                        history.push('/login');
                    }
                }
            }}
        >
            {() => (
                <Form>
                    <AuthWrapper>
                        <Box boxSize={["sm", "sm", "sm", "md"]}>
                            <Image
                                src="https://res.cloudinary.com/dw3hb6ec8/image/upload/v1614362319/notatboken/change-password_xmdugh.png"
                            />
                        </Box>
                        <Stack spacing={5}>
                            <Heading as="h1" size="xl">
                                Change Password
                            </Heading>
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
                            >
                                Change Password
                            </Button>
                        </Stack>
                    </AuthWrapper>
                </Form>
            )}
        </Formik>
    );
}