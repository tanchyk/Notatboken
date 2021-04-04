import React from "react";
import {useRouter} from "next/router";
import {Box, Button, IconButton, Link, Stack, Tooltip, useToast} from "@chakra-ui/react";
import {Field, FieldProps, Form, Formik} from "formik";
import {toErrorMap} from "../../utils/toErrorMap";
import {AuthWrapper} from "../../components/wrappers/AuthWrapper";
import {validateEmail} from "../../utils/validationFunctions";
import {UserInput} from "../../components/inputs/UserInput";
import NextLink from "next/link";
import {FaUserPlus} from "react-icons/fa";
import {withApollo} from "../../utils/withApollo";
import {useRequestEmailConfirmationMutation} from "../../generated/graphql";

const SendRequest: React.FC = () => {
    const router = useRouter();
    const toast = useToast();
    const [requestConfirmation, {loading}] = useRequestEmailConfirmationMutation();

    return (
        <Formik
            initialValues={{
                email: ''
            }}
            onSubmit={async (values, {setErrors}) => {
                const response = await requestConfirmation({
                    variables: {email: values.email}
                });

                if(response.data?.requestEmailConfirmation.errors) {
                    return setErrors(toErrorMap(response.data?.requestEmailConfirmation.errors));
                } else if(response.data?.requestEmailConfirmation.send === true) {
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
                        page="Confirm Email"
                        src="https://res.cloudinary.com/dw3hb6ec8/image/upload/v1617481922/mainpage/send-request_ycjlry.png"
                        to="/register"
                        text="If you dont have account yet, sign up"
                    >
                        <Box>
                            <Field name="email" validate={validateEmail}>
                                {({field, form}: FieldProps) => (
                                    <UserInput
                                        size="lg"
                                        name="email"
                                        placeholder="Enter your Email"
                                        field={field}
                                        form={form}
                                    />
                                )}
                            </Field>
                        </Box>
                        <Stack spacing={2} direction="row" alignItems="center">
                            <Button
                                width="120px"
                                type="submit"
                                isLoading={loading}
                            >
                                Send Email
                            </Button>
                            <Tooltip label="Register new user">
                                <NextLink href="/register">
                                    <IconButton aria-label="register" icon={<FaUserPlus/>}/>
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

export default withApollo({ssr: false})(SendRequest);