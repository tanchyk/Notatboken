import React from 'react';
import {Box, Button, Text} from "@chakra-ui/react";
import {Field, Form, Formik} from "formik";
import {validatePassword} from "../utils/validationFunctions";
import {FieldProps} from "../utils/types";
import {PasswordInput} from "../components/inputs/PasswordInput";
import {useRouteMatch} from "react-router-dom";
import {AuthWrapper} from "../components/wrappers/AuthWrapper";
import {useSelector} from "react-redux";
import {csrfData} from "../store/csrfSlice";
import {history} from "../App";
import {ppdRequest} from "../store/requestFunction";

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
                    if(csrfToken) {
                        const response = await ppdRequest(csrfToken, {password: values.newPassword, token}, '/users/change-forgot-password', 'POST');
                        if(response.status === 204) {
                            history.push('/login');
                        }
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
                        >
                            Change Password
                        </Button>
                    </AuthWrapper>
                </Form>
            )}
        </Formik>
    );
}