import React from 'react';
import LoginPage from "./pages/LoginPage";
import {ChakraProvider, extendTheme} from "@chakra-ui/react";

// @ts-ignore
const theme = extendTheme({
    styles: {
        global: {
            "html, body": {
                fontSize: "sm",
                backgroundColor: "#f7f7f7",
                color: "gray.600",
                lineHeight: "tall",
            },
            a: {
                color: "#FAF089"
            },
            button: {
                backgroundColor: "black"
            }
        },
    },
})

const App: React.FC<{}> = () => {
    return (
        <ChakraProvider theme={theme}>
            <LoginPage/>
        </ChakraProvider>
    );
}

export default App;
