import React from "react";
import {Field, FieldProps, Form, Formik} from 'formik';
import {Button, IconButton, Link, Stack, Tooltip} from "@chakra-ui/react";
import {MeDocument, MeQuery, useLoginMutation} from "../generated/graphql";
import {useRouter} from "next/router";
import NextLink from 'next/link';
import {withApollo} from "../utils/withApollo";
import {AuthWrapper} from "../components/wrappers/AuthWrapper";
import {validatePassword, validateUsernameOrEmail} from "../utils/validationFunctions";
import {PasswordInput} from "../components/inputs/PasswordInput";
import {AiFillUnlock} from "react-icons/ai";
import {UserInput} from "../components/inputs/UserInput";
import {toErrorMap} from "../utils/toErrorMap";

const Login: React.FC = ({}) => {
    const router = useRouter();
    const [login, {loading}] = useLoginMutation();

    return (
        <Formik
            initialValues={{usernameOrEmail: "", password: ""}}
            onSubmit={async (values, {setErrors}) => {
                const response = await login({
                    variables: {input: values},
                    update: (
                        cache,
                        {data}
                    ) => {
                        cache.writeQuery<MeQuery>({
                           query: MeDocument,
                           data: {
                               __typename: "Query",
                               me: data?.login.user
                           }
                        });
                    }
                });

                if(response.data?.login.errors) {
                    return setErrors(toErrorMap(response.data?.login.errors))
                } else if(response.data?.login.user) {
                    return router.push('/');
                }
            }}
        >
            {() => (
                <Form>
                    <AuthWrapper
                        page="Login"
                        src="https://res.cloudinary.com/dw3hb6ec8/image/upload/v1614424865/mainpage/login_f0ccax.png"
                        to={`/register`}
                        text='If you dont have account yet, sign up '
                    >
                        <Field name="usernameOrEmail" validate={validateUsernameOrEmail}>
                            {({field, form}: FieldProps) => (
                                <UserInput
                                    size="md"
                                    name="usernameOrEmail"
                                    placeholder="Email or Username"
                                    field={field}
                                    form={form}
                                />
                            )}
                        </Field>
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
                                isLoading={loading}
                            >
                                Login
                            </Button>
                            <Tooltip label="Forgot Password">
                                <NextLink href="/forgot-password">
                                    <IconButton aria-label="forgot-password" icon={<AiFillUnlock/>}/>
                                </NextLink>
                            </Tooltip>
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

export default withApollo({ssr: false})(Login);