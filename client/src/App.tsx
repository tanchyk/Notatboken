import React from 'react';
import {ChakraProvider, extendTheme} from "@chakra-ui/react";
import {BrowserRouter, Route} from "react-router-dom";
import {MainPage} from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";

const theme = extendTheme({
    styles: {
        global: {
            "html, body": {
                fontSize: "sm",
                backgroundColor: "#f7f7f7",
                color: "gray.600",
                lineHeight: "tall",
            },
            button: {
                backgroundColor: "black"
            }
        },
    },
})

const App: React.FC<{}> = () => {
    const isAuth = false;
    let routes;

    if (isAuth) {
        routes = (
            <>
                <Route exact path="/notes"/>
                <Route exact path="/profile"/>
            </>
        );
    } else {
        routes = (
            <>
                <Route exact path="/" component={MainPage}/>
                <Route exact path="/login" component={LoginPage}/>
            </>
        );
    }

    return (
        <BrowserRouter>
            <ChakraProvider theme={theme}>
                {routes}
            </ChakraProvider>
        </BrowserRouter>
    );
}

export default App;
