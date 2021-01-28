import React, {useEffect} from "react";
import {
    Text,
    Box,
    Button,
    useToast
} from "@chakra-ui/react";
import {Field, Form, Formik} from "formik";
import {BasicUser, FieldProps} from "../../utils/types";
import {validateEmail, validateUsername} from "../../utils/validationFunctions";
import {useDispatch, useSelector} from "react-redux";
import {errorNull, updateUser, userData, userError, userStatus} from "../../store/userSlice";
import {AppDispatch} from "../../store/store";
import {ProfileWrapper} from "../wrappers/ProfileWrapper";
import {UserInput} from "../inputs/UserInput";

const validateName = (value: string) => {
    let error;
    const checkName = /^([a-zA-Z]{2,}\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z]{1,})?)/i;
    if (!checkName.test(value) || value.length < 5) {
        error = 'Please, enter a full name and surname';
    }
    return error;
}

export const BasicInformation: React.FC<{}> = () => {
    const toast = useToast();

    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector(userData);
    const error = useSelector(userError);
    const status = useSelector(userStatus);

    useEffect(() => {
        if (error.type === 'update') {
            toast({
                position: 'bottom',
                title: "Account is not updated.",
                description: error.message,
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        } else if (status === 'succeeded' && error.message === 'updated') {
            toast({
                position: 'bottom',
                title: "Account updated.",
                description: "We've updated your account for you.",
                status: "success",
                duration: 9000,
                isClosable: true,
            });
        }
    }, [status, error])

    return (
        <Formik
            initialValues={{
                name: user.name,
                email: user.email,
                username: user.username
            } as BasicUser}
            onSubmit={async (values) => {
                if(values.name === user.name && values.email === user.email && values.username === user.username) {
                    toast({
                        position: 'bottom',
                        title: "Account is not updated.",
                        description: "You have not changed a thing!",
                        status: "error",
                        duration: 9000,
                        isClosable: true,
                    })
                } else {
                    await dispatch(updateUser(values));
                    await dispatch(errorNull());
                }
            }}
        >
            {() => (
                <Form>
                    <ProfileWrapper variant='Basic Information'>
                        <Box>
                            <Text fontSize="lg" marginBottom={3} fontWeight="bold">Name</Text>
                            <Field name="name" validate={validateName}>
                                {({field, form}: FieldProps) => (
                                    <UserInput
                                        size="lg"
                                        name="name"
                                        field={field}
                                        form={form}
                                    />
                                )}
                            </Field>
                        </Box>
                        <Box>
                            <Text fontSize="lg" marginBottom={3} fontWeight="bold">Email</Text>
                            <Field name="email" validate={validateEmail}>
                                {({field, form}: FieldProps) => (
                                    <UserInput
                                        size="lg"
                                        name="email"
                                        field={field}
                                        form={form}
                                    />
                                )}
                            </Field>
                        </Box>
                        <Box>
                            <Text fontSize="lg" marginBottom={3} fontWeight="bold">Username</Text>
                            <Field name="username" validate={validateUsername}>
                                {({field, form}: FieldProps) => (
                                    <UserInput
                                        size="lg"
                                        name="username"
                                        field={field}
                                        form={form}
                                    />
                                )}
                            </Field>
                        </Box>
                        <Button
                            width="120px"
                            type="submit"
                            variantсolor='teal'
                        >
                            Update Profile
                        </Button>
                    </ProfileWrapper>
                </Form>
            )}
        </Formik>
    );
}