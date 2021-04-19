import React from "react";
import {withApollo} from "../../utils/withApollo";
import {AccountLayout} from "../../layouts/AccountLayout";
import {Layout} from "../../layouts/Layout";
import {MeDocument, MeQuery, useEditUserMutation, useMeQuery} from "../../generated/graphql";
import {
    Alert,
    AlertDescription,
    AlertIcon,
    Box,
    Button,
    Flex,
    Heading,
    Stack,
    Text,
    useToast
} from "@chakra-ui/react";
import {Field, FieldProps, Form, Formik} from "formik";
import {validateEmail, validateName, validateUsername} from "../../utils/validationFunctions";
import {UserInput} from "../../components/inputs/UserInput";
import {AvatarZone} from "../../components/account/AvatarZone";
import {Loading} from "../../components/Loading";
import Custom404 from "../404";
import {toErrorMap} from "../../utils/toErrorMap";
import {AccountWrapper} from "../../components/wrappers/AccountWrapper";

const BasicInformation: React.FC = ({}) => {
    const toast = useToast();
    const {data, loading} = useMeQuery();
    const [editUser, {loading: loadingUser}] = useEditUserMutation();

    if(loading) {
        return <Loading />;
    } else if(!data?.me) {
        return <Custom404 />;
    }

    return (
        <Layout variant="small">
            <AccountLayout>
                <Formik
                    initialValues={{
                        name: data.me.name,
                        email: data.me.email,
                        username: data.me.username,
                        avatarData: data.me.avatar
                    }}
                    onSubmit={async (values, {setErrors, }) => {
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
                            });
                        } else {
                            const response = await editUser({
                                variables: {input: values},
                                update: (
                                    cache,
                                    {data}
                                ) => {
                                    if(data?.editUser.user) {
                                        cache.writeQuery<MeQuery>({
                                                query: MeDocument,
                                                data: {
                                                    __typename: "Query",
                                                    me: data.editUser.user
                                                }
                                            }
                                        )
                                    }
                                }
                            });

                            if(response.data?.editUser.errors) {
                                await setErrors(toErrorMap(response.data?.editUser.errors));
                            } else if(response.data?.editUser.user) {
                                toast({
                                    position: 'bottom',
                                    title: "Account is updated.",
                                    description: "We've updated your account for you.",
                                    status: "success",
                                    duration: 9000,
                                    isClosable: true,
                                });
                                if(response.data?.editUser.user.email !== values.email) {
                                    toast({
                                        position: 'bottom',
                                        title: "Check your email.",
                                        description: "Please stay logged in for confirmation of a new email.",
                                        duration: 9000,
                                        isClosable: true,
                                    });
                                }
                            }
                        }
                    }}
                >
                    {() => (
                        <Form>
                            <AccountWrapper>
                                <Flex direction="row">
                                    <Heading size="lg">
                                        Basic Information
                                    </Heading>
                                    <Text fontSize="20px" ml={2}>📖</Text>
                                </Flex>
                                <Stack spacing={4}>
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
                                </Stack>
                                <Box>
                                    <Text fontSize="lg" marginBottom={3} fontWeight="bold">Avatar</Text>
                                    <Field name="avatarData">
                                        {({field, form}: FieldProps) => (
                                            <>
                                                <AvatarZone avatar={field.value} username={data?.me!.username} />
                                                {
                                                    form.errors.avatarData ? (
                                                        <Alert status="error" mt={6} fontSize="lg">
                                                            <AlertIcon />
                                                            <AlertDescription>{form.errors.avatarData}</AlertDescription>
                                                        </Alert>
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
                                    isLoading={loadingUser}
                                >
                                    Update Profile
                                </Button>
                            </AccountWrapper>
                        </Form>
                    )}
                </Formik>
            </AccountLayout>
        </Layout>
    );
}

export default withApollo({ssr: false})(BasicInformation);