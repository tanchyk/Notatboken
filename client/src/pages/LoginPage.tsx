import React from 'react';
import {Box, Button, Input, InputGroup, InputRightElement, Stack} from "@chakra-ui/react";

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
        <>
            <Box maxW="lg" borderWidth="1px" borderRadius="lg" overflow="hidden" padding="20px" backgroundColor="#fff">
            <Stack spacing={3}>
                <Input variant="outline" placeholder="Email or Username" />
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
            </Stack>
            <Box>
                <Button
                    mt={4}
                    width="120px"
                    // isLoading={isSubmitting}
                    type="submit"
                    variantColor={'teal'}
                >
                    Login
                </Button>
            </Box>
            </Box>
        </>
    );
}

export default LoginPage;
