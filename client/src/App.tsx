import React, {useEffect} from 'react';
import {ChakraProvider, extendTheme} from "@chakra-ui/react";
import {BrowserRouter, Redirect, Route, Router, Switch} from "react-router-dom";
import {MainPage} from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import { createBrowserHistory } from 'history';
import Notes from "./pages/NotesPage";
import RegisterPage from "./pages/RegisterPage";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "./store/store";
import {loadUser, userData} from "./store/userSlice";
import {fetchToken} from "./store/csrfSlice";
import NavBar from "./components/Navbar";

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
    const dispatch = useDispatch<AppDispatch>();

    const user = useSelector(userData);

    useEffect(() => {
        dispatch(fetchToken());
        dispatch(loadUser());
    }, []);

    let routes;

    if (!!user.userId) {
        routes = (
            <Switch>
                <NavBar />
                <Route exact path="/notes" component={Notes}/>
                <Route exact path="/profile"/>
                <Redirect to="/notes"/>
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
