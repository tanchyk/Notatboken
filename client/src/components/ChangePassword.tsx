import React, {useState} from "react";
import {FieldProps, Passwords} from "../utils/types";
import {Field, Form, Formik} from "formik";
import {ProfileWrapper} from "./wrappers/ProfileWrapper";
import {
    Box,
    Text,
    Alert,
    AlertIcon,
    Button,
} from "@chakra-ui/react";
import {validatePassword} from "../utils/validationFunctions";
import {useSelector} from "react-redux";
import {csrfData} from "../store/csrfSlice";
import {PasswordInput} from "./inputs/PasswordInput";

export const ChangePassword: React.FC<{}> = () => {
    //Data
    const [message, setMessage] = useState<string | null>('Password should contain at least one number, one lowercase and one uppercase letter');
    const [status, setStatus] = useState<'warning' | 'success' | 'error'>('warning');
    const csrfToken = useSelector(csrfData);

    const changePasswordHandler = async (values: Passwords) => {
        const response = await fetch('/users/change-password', {
            method: 'POST',
            body: JSON.stringify({
                newPassword: values.newPassword,
                oldPassword: values.oldPassword
            }),
            headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': `${csrfToken}`
            }
        });
        return (await response.json()) as {message: string} | {error: string};
    }

    return (
        <Formik
            initialValues={{
                newPassword: '',
                confirmPassword: '',
                oldPassword: ''
            } as Passwords}
            onSubmit={async (values, {resetForm}) => {
                //Checking confirmation
                if(values.newPassword !== values.confirmPassword) {
                    setMessage('Your new password does not match the password you typed to confirm, please check your passwords');
                    setStatus('error');
                    return;
                }

                //Request
                const result = await changePasswordHandler(values);

                //Looking for errors
                if("message" in result) {
                    setMessage(result.message);
                    if(result.message === 'Password is changed') {
                        setStatus('success');
                        resetForm();
                    } else {
                        setStatus('error');
                    }
                } else if("error" in result) {
                    console.log(result.error);
                }
            }}
        >
            {() => (
                <Form>
                    <ProfileWrapper variant='Change Password'>
                        <Alert status={status} fontSize="lg">
                            <AlertIcon />
                            {message}
                        </Alert>
                        <Box>
                            <Text fontSize="lg" marginBottom={3} fontWeight="bold">New Password</Text>
                            <Field name="newPassword" validate={validatePassword}>
                                {({field, form}: FieldProps) => (
                                    <PasswordInput
                                        size="lg"
                                        name="newPassword"
                                        placeholder="Please, enter new password"
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
                                        placeholder="Please, confirm your new password"
                                        field={field}
                                        form={form}
                                    />
                                )}
                            </Field>
                        </Box>
                        <Box>
                            <Text fontSize="lg" marginBottom={3} fontWeight="bold">Old Password</Text>
                            <Field name="oldPassword" validate={validatePassword}>
                                {({field, form}: FieldProps) => (
                                    <PasswordInput
                                        size="lg"
                                        name="oldPassword"
                                        placeholder="Please, enter your old password"
                                        field={field}
                                        form={form}
                                    />
                                )}
                            </Field>
                        </Box>
                        <Button
                            width="130px"
                            type="submit"
                            variantсolor='teal'
                        >
                            Update Password
                        </Button>
                    </ProfileWrapper>
                </Form>
            )}
        </Formik>
    );
}