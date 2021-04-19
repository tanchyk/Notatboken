import React, {useEffect, useRef, useState} from "react";
import {Field, Form, Formik} from "formik";
import {ProfileWrapper} from "../wrappers/ProfileWrapper";
import {
    Flex,
    Alert,
    AlertIcon,
    Box,
    Button,
    Text,
    Heading
} from "@chakra-ui/react";
import {validatePassword} from "../../utils/validationFunctions";
import {FieldProps} from "../../utils/types";
import {PasswordInput} from "../inputs/PasswordInput";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../../store/store";
import {deleteUser, userError, userStatus} from "../../store/userSlice";
import {SerializedError} from "@reduxjs/toolkit";
import {DeleteAlert} from "../DeleteAlert";

export const DeleteAccount: React.FC<{}> = () => {
    //Functions for confirmation page
    const [isOpen, setIsOpen] = React.useState(false);
    const onClose = () => setIsOpen(false);
    const cancelRef = useRef<HTMLButtonElement>(null);

    //Warning or error
    const [message, setMessage] = useState<string | SerializedError | null>('You can delete your account at any time, however this action is irreversible. Please enter your password to confirm you’re the account owner.');
    const [statusAlert, setStatusAlert] = useState<'warning' | 'error'>('warning');

    //Redux State
    const dispatch = useDispatch<AppDispatch>();

    const status = useSelector(userStatus);
    const errorMessage = useSelector(userError);

    useEffect(() => {
        if(status === 'failed' && errorMessage.type === 'deleteUser') {
            setMessage(errorMessage.message);
            setStatusAlert('error');
        }
    }, [errorMessage]);

    return (
        <Formik
            initialValues={{
                password: ''
            } as {password: string}}
            onSubmit={async (values) => {
                await dispatch(deleteUser(values));
            }}
        >
            {(props) => (
                <Form>
                    <ProfileWrapper>
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
                    </ProfileWrapper>
                </Form>
            )}
        </Formik>
    );
}