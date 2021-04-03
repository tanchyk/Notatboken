import React from "react";
import {useRegisterMutation} from "../generated/graphql";
import {useRouter} from "next/router";
import {withApollo} from "../utils/withApollo";
import {Field, FieldProps, Form, Formik} from "formik";
import {AuthWrapper} from "../components/wrappers/AuthWrapper";
import {validateEmail, validatePassword, validateUsername} from "../utils/validationFunctions";
import {PasswordInput} from "../components/inputs/PasswordInput";
import {Button, Link, Stack, useToast} from "@chakra-ui/react";
import NextLink from "next/link";
import {UserInput} from "../components/inputs/UserInput";
import {toErrorMap} from "../utils/toErrorMap";

const Register: React.FC = ({}) => {
    const router = useRouter();
    const [register] = useRegisterMutation();
    const toast = useToast();

    return (
        <Formik
            initialValues={{username: "", email: "", password: ""}}
            onSubmit={async (values, {setErrors}) => {
                const response = await register({
                    variables: {input: values},
                });

                if(response.data?.register.errors) {
                    return setErrors(toErrorMap(response.data.register.errors));
                } else if(response.data?.register.send === true) {
                    toast({
                        position: 'bottom',
                        title: "Email is sent.",
                        description: "Check your email for confirmation message.",
                        status: "success",
                        duration: 9000,
                        isClosable: true,
                    });
                    return router.push('/');
                }
            }}
        >
            {() => (
                <Form>
                    <AuthWrapper
                        page="Sign up"
                        src="https://res.cloudinary.com/dw3hb6ec8/image/upload/v1614424866/mainpage/register_aamjpe.png"
                        to={`/login`}
                        text='If you have an account, login '
                    >
                        <Stack spacing={5}>
                            <Field name="username" validate={validateUsername}>
                                {({field, form}: FieldProps) => (
                                    <UserInput
                                        size="md"
                                        name="username"
                                        placeholder="Enter username"
                                        field={field}
                                        form={form}
                                    />
                                )}
                            </Field>
                            <Field name="email" validate={validateEmail}>
                                {({field, form}: FieldProps) => (
                                    <UserInput
                                        size="md"
                                        name="email"
                                        placeholder="Enter email"
                                        field={field}
                                        form={form}
                                    />
                                )}
                            </Field>
                        </Stack>
                        <Field name="password" validate={validatePassword}>
                            {({field, form}: FieldProps) => (
                                <PasswordInput
                                    size="md"
                                    name="password"
                                    placeholder="Enter password"
                                    field={field}
                                    form={form}
                                />
                            )}
                        </Field>
                        <Stack spacing={2} direction="row" alignItems="center">
                            <Button
                                width="120px"
                                type="submit"
                            >
                                Sign up
                            </Button>
                            <Link color="blue.500" href="/" pl={3}>
                                <NextLink href="/">
                                    Home
                                </NextLink>
                            </Link>
                        </Stack>
                    </AuthWrapper>
                </Form>
            )}
        </Formik>
    );
}

export default withApollo({ssr: false})(Register);