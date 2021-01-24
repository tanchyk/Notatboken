import React from "react";
import {Stack, Heading, Text, Input, Box, Button, FormControl, FormErrorMessage} from "@chakra-ui/react";
import {Field, Form, Formik} from "formik";
import {BasicUser, FieldProps} from "../utils/types";
import {validateEmail, validateUsername} from "../utils/validationFunctions";
import {useSelector} from "react-redux";
import {userData} from "../store/userSlice";

const validateName = (value: string) => {
    let error;
    const checkName = /^(?:[-A-Z]+ )+[-A-Z]+$/;
    if (!checkName.test(value)) {
        error = 'Please, enter a full name and surname';
    }
    return error;
}

export const BasicInformation: React.FC<{}> = () => {
    const user = useSelector(userData);

    return (
        <Formik
            initialValues={{
                name: "",
                email: user.email,
                username: user.username
            } as BasicUser}
            onSubmit={async (values) => {
                console.log(values)
            }}
        >
            {() => (
                <Form>
                    <Stack

                        borderWidth="1px"
                        borderLeftWidth="4px"
                        borderRadius="lg"
                        overflow="hidden"
                        padding={8}
                        paddingLeft={10}
                        backgroundColor="#fff"
                        marginTop={["0px", "0px", "30px", "30px"]}
                        spacing={6}
                    >
                        <Heading size="lg">
                            Basic Information
                        </Heading>
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
                            width="140px"
                            type="submit"
                            variantсolor='teal'
                            size="lg"
                        >
                            Update Profile
                        </Button>
                    </Stack>
                </Form>
            )}
        </Formik>
    );
}