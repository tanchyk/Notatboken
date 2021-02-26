import React from "react";
import {Stack, useStyleConfig} from "@chakra-ui/react";

export const AuthWrapper: React.FC = ({children}) => {
    const styleStack = useStyleConfig("Stack");

    return (
        <Stack
            sx={styleStack}
            maxW={["100%", "90%", "70%", "50%"]}
            padding="20px"
            margin="auto"
            marginTop={["10px", "20px", "40px", "100px"]}
            direction="row"
            wrap="wrap"
            alignItems="center"
            justifyContent="center"
        >
            {children}
        </Stack>
    );
}