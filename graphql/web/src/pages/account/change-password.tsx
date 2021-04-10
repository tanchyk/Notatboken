import React, {useState} from "react";
import {Field, FieldProps, Form, Formik} from "formik";
import {Alert, AlertIcon, Box, Button, Flex, Heading, Text,} from "@chakra-ui/react";
import {validatePassword} from "../../utils/validationFunctions";
import {PasswordInput} from "../../components/inputs/PasswordInput";
import {AccountWrapper} from "../../components/wrappers/AccountWrapper";
import {AccountLayout} from "../../layouts/AccountLayout";
import {Layout} from "../../layouts/Layout";
import {useChangePasswordMutation} from "../../generated/graphql";
import {withApollo} from "../../utils/withApollo";

const ChangePassword: React.FC<{}> = () => {
    const [message, setMessage] = useState<string | null>('');
    const [status, setStatus] = useState<'warning' | 'success' | 'error'>('warning');

    const [changePassword, {loading}] = useChangePasswordMutation();

    return (
        <Layout variant="small">
            <AccountLayout>
                <Formik
                    initialValues={{
                        newPassword: '',
                        confirmPassword: '',
                        oldPassword: ''
                    }}
                    onSubmit={async (values, {resetForm}) => {
                        //Checking confirmation
                        if(values.newPassword !== values.confirmPassword) {
                            setMessage('Your new password does not match the password you typed to confirm, please check your passwords');
                            setStatus('error');
                            return;
                        }

                        const response = await changePassword({
                            variables: {
                                newPassword: values.newPassword,
                                oldPassword: values.oldPassword
                            }
                        })

                        if(response.data?.changePassword.errors) {
                            setMessage(response.data?.changePassword.errors[0].message);
                            setStatus('error');
                            return;
                        }

                        setMessage('Password is changed');
                        setStatus('success');
                        resetForm();
                    }}
                >
                    {() => (
                        <Form>
                            <AccountWrapper>
                                <Flex direction="row">
                                    <Heading size="lg">
                                        Change Password
                                    </Heading>
                                    <Text fontSize="20px" ml={2}>🔒</Text>
                                </Flex>
                                {
                                    message ? (
                                        <Alert status={status} fontSize="lg">
                                            <AlertIcon />
                                            {message}
                                        </Alert>
                                    ) : null
                                }
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
                                    width="150px"
                                    type="submit"
                                    size="lg"
                                    isLoading={loading}
                                >
                                    Update Password
                                </Button>
                            </AccountWrapper>
                        </Form>
                    )}
                </Formik>
            </AccountLayout>
        </Layout>
    );
}

export default withApollo({ssr: false})(ChangePassword);