import React from "react";
import {withApollo} from "../../utils/withApollo";
import {AccountLayout} from "../../layouts/AccountLayout";
import {Layout} from "../../layouts/Layout";
import {useMeQuery} from "../../generated/graphql";
import Custom404 from "../404";
import {Box, Button, Flex, Heading, Text, useToast} from "@chakra-ui/react";
import {Field, FieldProps, Form, Formik } from "formik";
import { validateEmail, validateName, validateUsername } from "../../utils/validationFunctions";
import { UserInput } from "../../components/inputs/UserInput";
import { AvatarZone } from "../../components/account/AvatarZone";

const Index: React.FC = ({}) => {
    const toast = useToast();
    const {data} = useMeQuery();

    if(!data?.me) {
        return <Custom404 />;
    }

    return (
        <Layout variant="small">
            <AccountLayout>
                <Formik
                    initialValues={{
                        name: data?.me.name,
                        email: data?.me.email,
                        username: data?.me.username,
                        avatarData: data?.me.avatar
                    }}
                    onSubmit={async (values) => {
                        if (data?.me &&
                            values.name === data?.me.name &&
                            values.email === data?.me.email &&
                            values.username === data?.me.username &&
                            values.avatarData === null
                        ) {
                            toast({
                                position: 'bottom',
                                title: "Account is not updated.",
                                description: "You have not changed a thing!",
                                status: "error",
                                duration: 9000,
                                isClosable: true,
                            })
                        } else {

                        }
                    }}
                >
                    {() => (
                        <Form>
                                <Flex direction="row">
                                    <Heading size="lg">
                                        Basic Information
                                    </Heading>
                                    <Text fontSize="20px" ml={2}>📖</Text>
                                </Flex>
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
                                <Box>
                                    <Text fontSize="lg" marginBottom={3} fontWeight="bold">Avatar</Text>
                                    <Field name="avatarData">
                                        {({field, form}: FieldProps) => (
                                            <>
                                                <AvatarZone avatar={field.value} username={data?.me!.username} />
                                                {
                                                    form.errors.avatarData ? (
                                                        <Text
                                                            fontWeight="600"
                                                            fontSize="lg"
                                                            color="red.500"
                                                            mt={3}
                                                        >
                                                            {form.errors.avatarData}
                                                        </Text>
                                                    ) : null
                                                }
                                            </>
                                        )}
                                    </Field>
                                </Box>
                                <Button
                                    width="130px"
                                    type="submit"
                                    size="lg"
                                >
                                    Update Profile
                                </Button>
                        </Form>
                    )}
                </Formik>
            </AccountLayout>
        </Layout>
    );
}

export default withApollo({ssr: false})(Index);