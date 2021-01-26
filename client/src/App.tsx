import React, {useEffect} from 'react';
import {ChakraProvider} from "@chakra-ui/react";
import {BrowserRouter, Route, Router, Switch} from "react-router-dom";
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
import {ProfilePage} from "./pages/ProfilePage";
import {theme} from "./utils/theme";

export const history = createBrowserHistory();

const App: React.FC<{}> = () => {
    const dispatch = useDispatch<AppDispatch>();

    const user = useSelector(userData);

    useEffect(() => {
        dispatch(fetchToken());
        dispatch(loadUser());
    }, [dispatch]);

    let routes;

    if (!!user.userId) {
        routes = (
            <>
                <NavBar />
                <Switch>
                    <Route exact path="/" component={Notes}/>
                    <Route exact path="/notes" component={Notes}/>
                    <Route exact path="/profile" component={ProfilePage}/>
                </Switch>
            </>
        );
    } else {
        routes = (
            <Switch>
                <Route exact path="/" component={MainPage}/>
                <Route exact path="/login" component={LoginPage}/>
                <Route exact path="/register" component={RegisterPage}/>
            </Switch>
        );
    }

    return (
        <BrowserRouter basename='/'>
            <ChakraProvider theme={theme}>
                <Router history={history}>
                    {routes}
                </Router>
            </ChakraProvider>
        </BrowserRouter>
    );
}

export default App;
