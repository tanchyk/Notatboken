import React from 'react';
import {ChakraProvider, extendTheme} from "@chakra-ui/react";
import {BrowserRouter, Redirect, Route, Router, Switch} from "react-router-dom";
import {MainPage} from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import { createBrowserHistory } from 'history';
import Notes from "./pages/NotesPage";
import RegisterPage from "./pages/RegisterPage";

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
            <Switch>
                <Route exact path="/" component={Notes}/>
                <Route exact path="/profile"/>
                <Redirect to="/"/>
            </Switch>
        );
    } else {
        routes = (
            <Switch>
                <Route exact path="/" component={MainPage}/>
                <Route exact path="/login" component={LoginPage}/>
                <Route exact path="/register" component={RegisterPage}/>
                <Redirect to="/"/>
            </Switch>
        );
    }

    return (
        <BrowserRouter>
            <ChakraProvider theme={theme}>
                <Router history={history}>
                    {routes}
                </Router>
            </ChakraProvider>
        </BrowserRouter>
    );
}

export default App;
