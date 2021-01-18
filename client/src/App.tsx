import React from 'react';
import {ChakraProvider, extendTheme} from "@chakra-ui/react";
import {BrowserRouter, Route, Router} from "react-router-dom";
import {MainPage} from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import { createBrowserHistory } from 'history';
import Notes from "./pages/NotesPage";

export const history = createBrowserHistory();

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
    const isAuth = !!localStorage.getItem('userId');
    let routes;

    if (isAuth) {
        routes = (
            <Router history={history}>
                <Route exact path="/" component={Notes}/>
                <Route exact path="/profile"/>
            </Router>
        );
    } else {
        routes = (
            <Router history={history}>
                <Route exact path="/" component={MainPage}/>
                <Route exact path="/login" component={LoginPage}/>
            </Router>
        );
    }

    return (
        <BrowserRouter >
            <ChakraProvider theme={theme}>
                {routes}
            </ChakraProvider>
        </BrowserRouter>
    );
}

export default App;
