import React from 'react';
import {Box, Button, Heading, Image, Input, InputGroup, InputRightElement, Link, Stack} from "@chakra-ui/react";
import {ExternalLinkIcon} from '@chakra-ui/icons'

// interface InputData {
//     username: string,
//     email: string,
//     password: string
// }

const LoginPage: React.FC<{}> = () => {
    // const [inputData, setInputData] = useState<InputData>({
    //     username: '',
    //     email: '',
    //     password: ''
    // });

    const [show, setShow] = React.useState(false)
    const handleClick = () => setShow(!show)

    return (
        <Stack
            maxW={["100%", "90%", "70%", "50%"]}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            padding="20px"
            backgroundColor="#fff"
            margin="auto"
            marginTop={["10px", "20px", "40px", "100px"]}
        >
            <Stack
                direction="row"
                wrap="wrap"
                alignItems="center"
                justifyContent="center"
            >
                <Stack spacing={5} textAlign="center">
                    <Box boxSize={["sm", "sm", "sm", "md"]}>
                        <Image
                            src="https://image.freepik.com/vecteurs-libre/ordinateur-portable-smartphone-casque-cartoon-icon-illustration-concept-icone-technologie-entreprise-isole-style-bande-dessinee-plat_138676-2139.jpg"
                        />
                    </Box>
                    <Link href="https://chakra-ui.com" isExternal>
                        If you dont have account yet, register <ExternalLinkIcon mx="2px" />
                    </Link>
                </Stack>
                <Stack spacing={5}>
                    <Heading as="h1" size="xl">
                        Login
                    </Heading>

                    <Input variant="outline" placeholder={"Email or Username"}/>
                    <InputGroup size="md">
                        <Input
                            pr="4.5rem"
                            type={show ? "text" : "password"}
                            placeholder="Enter password"
                        />
                        <InputRightElement width="4.5rem">
                            <Button h="1.75rem" size="sm" onClick={handleClick}>
                                {show ? "Hide" : "Show"}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                    <Stack spacing={5} direction="row" alignItems="center">
                        <Button
                            width="120px"
                            // isLoading={isSubmitting}
                            type="submit"
                            variantColor={'teal'}
                        >
                            Login
                        </Button>
                        <Link color="blue.500" href="#">
                            Home
                        </Link>
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    );
}

export default LoginPage;
