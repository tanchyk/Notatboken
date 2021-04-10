import React, {useRef, useState} from "react";
import {Field, FieldProps, Form, Formik} from "formik";
import {Alert, AlertIcon, Box, Button, Flex, Heading, Text} from "@chakra-ui/react";
import {validatePassword} from "../../utils/validationFunctions";
import {DeleteAlert} from "../../alerts/DeleteAlert";
import {PasswordInput} from "../../components/inputs/PasswordInput";
import {AccountLayout} from "../../layouts/AccountLayout";
import {Layout} from "../../layouts/Layout";
import {AccountWrapper} from "../../components/wrappers/AccountWrapper";
import {useDeleteAccountMutation} from "../../generated/graphql";
import {useRouter} from "next/router";
import { useApolloClient } from "@apollo/client";
import { withApollo } from "../../utils/withApollo";

const DeleteAccount: React.FC<{}> = () => {
    //Functions for confirmation page
    const [isOpen, setIsOpen] = React.useState(false);
    const onClose = () => setIsOpen(false);
    const cancelRef = useRef<HTMLButtonElement>(null);

    const router = useRouter();
    const apolloClient = useApolloClient();
    const [deleteAccount] = useDeleteAccountMutation();

    //Warning or error
    const [message, setMessage] = useState<string>('You can delete your account at any time, however this action is irreversible. Please enter your password to confirm you’re the account owner.');
    const [statusAlert, setStatusAlert] = useState<'warning' | 'error'>('warning');

    return (
        <Layout variant="small">
            <AccountLayout>
                <Formik
                    initialValues={{
                        password: ''
                    } as {password: string}}
                    onSubmit={async (values) => {
                        const response = await deleteAccount({
                            variables: {
                                password: values.password
                            }
                        });

                        if(response.data?.deleteUser.errors) {
                            setMessage(response.data?.deleteUser.errors[0].message);
                            setStatusAlert('error');
                            return;
                        }

                        await apolloClient.resetStore();
                        return router.push('/');
                    }}
                >
                    {(props) => (
                        <Form>
                            <AccountWrapper>
                                <Flex direction="row">
                                    <Heading size="lg">
                                        Delete Account
                                    </Heading>
                                    <Text fontSize="20px" ml={2}>🗑</Text>
                                </Flex>
                                <Alert status={statusAlert} fontSize="lg">
                                    <AlertIcon />
                                    {message}
                                </Alert>
                                <Box>
                                    <Text fontSize="lg" marginBottom={3} fontWeight="bold">Password</Text>
                                    <Field name="password" validate={validatePassword}>
                                        {({field, form}: FieldProps) => (
                                            <PasswordInput
                                                size="lg"
                                                name="password"
                                                placeholder="Please, enter your password"
                                                field={field}
                                                form={form}
                                            />
                                        )}
                                    </Field>
                                </Box>
                                <Button
                                    width="130px"
                                    onClick={() => setIsOpen(true)}
                                    size="lg"
                                    _hover={{bg: "red.100"}}
                                >
                                    Delete Account
                                </Button>

                                //Alert delete
                                <DeleteAlert
                                    header="Delete Account"
                                    isOpen={isOpen}
                                    onClose={onClose}
                                    onClick={async () => {
                                        onClose()
                                        await props.submitForm()
                                    }}
                                    cancelRef={cancelRef}
                                />
                            </AccountWrapper>
                        </Form>
                    )}
                </Formik>
            </AccountLayout>
        </Layout>
    );
}

export default withApollo({ssr: false})(DeleteAccount);