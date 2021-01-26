import React from "react";
import {
    Text,
    Input,
    Box,
    Button,
    FormControl,
    FormErrorMessage
} from "@chakra-ui/react";
import {Field, Form, Formik} from "formik";
import {BasicUser, FieldProps} from "../utils/types";
import {validateEmail, validateUsername} from "../utils/validationFunctions";
import {useDispatch, useSelector} from "react-redux";
import {updateUser, userData} from "../store/userSlice";
import {AppDispatch} from "../store/store";
import {ProfileWrapper} from "./additional/ProfileWrapper";

const validateName = (value: string) => {
    let error;
    const checkName = /^[a-zA-Z].*[\s\.]*$/g;
    if (!checkName.test(value) || value.length < 5) {
        error = 'Please, enter a full name and surname';
    }
    return error;
}

export const BasicInformation: React.FC<{}> = () => {
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector(userData);

    return (
        <Formik
            initialValues={{
                name: user.name,
                email: user.email,
                username: user.username
            } as BasicUser}
            onSubmit={async (values) => {
                await dispatch(updateUser(values));
            }}
        >
            {() => (
                <Form>
                    <ProfileWrapper variant='Basic Information'>
                        <Box>
                            <Text fontSize="lg" marginBottom={3} fontWeight="bold">Name</Text>
                            <Field name="name" validate={validateName}>
                                {({field, form}: FieldProps) => (
                                    <FormControl isInvalid={!!form.errors.name && !!form.touched.name}>
                                        <Input
                                            {...field}
                                            variant="outline"
                                            placeholder={field.value}
                                            size="lg"
                                        />
                                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>
                        </Box>
                        <Box>
                            <Text fontSize="lg" marginBottom={3} fontWeight="bold">Email</Text>
                            <Field name="email" validate={validateEmail}>
                                {({field, form}: FieldProps) => (
                                    <FormControl isInvalid={!!form.errors.email && !!form.touched.email}>
                                        <Input
                                            {...field}
                                            variant="outline"
                                            placeholder={field.value}
                                            size="lg"
                                        />
                                        <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>
                        </Box>
                        <Box>
                            <Text fontSize="lg" marginBottom={3} fontWeight="bold">Username</Text>
                            <Field name="username" validate={validateUsername}>
                                {({field, form}: FieldProps) => (
                                    <FormControl isInvalid={!!form.errors.username && !!form.touched.password}>
                                        <Input
                                            {...field}
                                            variant="outline"
                                            placeholder={field.value}
                                            size="lg"
                                        />
                                        <FormErrorMessage>{form.errors.username}</FormErrorMessage>
                                    </FormControl>
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