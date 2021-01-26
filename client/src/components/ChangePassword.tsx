import React, {useState} from "react";
import {FieldProps, Passwords} from "../utils/types";
import {Field, Form, Formik} from "formik";
import {ProfileWrapper} from "./additional/ProfileWrapper";
import {
    Box,
    FormControl,
    FormErrorMessage,
    Input,
    Text,
    Alert,
    AlertIcon,
    Button,
    InputRightElement, InputGroup
} from "@chakra-ui/react";
import {validatePassword} from "../utils/validationFunctions";
import {useSelector} from "react-redux";
import {csrfData} from "../store/csrfSlice";

export const ChangePassword: React.FC<{}> = () => {
    //Password view
    const [showNew, setShowNew] = useState(false);
    const handleClickNew = () => setShowNew(!showNew);

    const [showCheck, setShowCheck] = useState(false);
    const handleClickCheck = () => setShowCheck(!showCheck);

    const [showOld, setShowOld] = useState(false);
    const handleClickOld = () => setShowOld(!showOld);

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
            onSubmit={async (values) => {
                const result = await changePasswordHandler(values);
                if("message" in result) {
                    setMessage(result.message);
                    if(result.message === 'Password is changed') {
                        setStatus('success');
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
                            <InputGroup>
                                <Field name="newPassword" validate={validatePassword}>
                                    {({field, form}: FieldProps) => (
                                        <FormControl
                                            isInvalid={!!form.errors.newPassword && !!form.touched.newPassword}>
                                            <Input
                                                {...field}
                                                placeholder="Please, enter a new password"
                                                name="newPassword"
                                                pr="4.5rem"
                                                size="lg"
                                                type={showNew ? "text" : "password"}
                                            />
                                            <FormErrorMessage>{form.errors.newPassword}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>
                                <InputRightElement width="4.5rem" mt={1}>
                                    <Button h="1.75rem" size="sm" onClick={handleClickNew}>
                                        {showNew ? "Hide" : "Show"}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </Box>
                        <Box>
                            <Text fontSize="lg" marginBottom={3} fontWeight="bold">Confirm New Password</Text>
                            <InputGroup>
                                <Field name="confirmPassword" validate={validatePassword}>
                                    {({field, form}: FieldProps) => (
                                        <FormControl
                                            isInvalid={!!form.errors.confirmPassword && !!form.touched.confirmPassword}>
                                            <Input
                                                {...field}
                                                placeholder="Please, confirm your new password"
                                                name="confirmPassword"
                                                pr="4.5rem"
                                                size="lg"
                                                type={showCheck ? "text" : "password"}
                                            />
                                            <FormErrorMessage>{form.errors.confirmPassword}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>
                                <InputRightElement width="4.5rem" mt={1}>
                                    <Button h="1.75rem" size="sm" onClick={handleClickCheck}>
                                        {showCheck ? "Hide" : "Show"}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </Box>
                        <Box>
                            <Text fontSize="lg" marginBottom={3} fontWeight="bold">Old Password</Text>
                            <InputGroup>
                                <Field name="oldPassword" validate={validatePassword}>
                                    {({field, form}: FieldProps) => (
                                        <FormControl
                                            isInvalid={!!form.errors.oldPassword && !!form.touched.oldPassword}>
                                            <Input
                                                {...field}
                                                placeholder="Please, enter your old password"
                                                name="oldPassword"
                                                pr="4.5rem"
                                                size="lg"
                                                type={showOld ? "text" : "password"}
                                            />
                                            <FormErrorMessage>{form.errors.oldPassword}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>
                                <InputRightElement width="4.5rem" mt={1}>
                                    <Button h="1.75rem" size="sm" onClick={handleClickOld}>
                                        {showOld ? "Hide" : "Show"}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
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
            )
            }
        </Formik>
    );
}