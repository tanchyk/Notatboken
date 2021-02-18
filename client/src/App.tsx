import React, {useEffect, useState} from 'react';
import {ChakraProvider} from "@chakra-ui/react";
import {BrowserRouter, Redirect, Route, Router, Switch} from "react-router-dom";
import {MainPage} from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import { createBrowserHistory } from 'history';
import StartPage from "./pages/StartPage";
import RegisterPage from "./pages/RegisterPage";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "./store/store";
import {loadUser, userData, userError, userStatus} from "./store/userSlice";
import {fetchToken} from "./store/csrfSlice";
import NavBar from "./components/Navbar";
import {ProfilePage} from "./pages/ProfilePage";
import {theme} from "./utils/theme";
import DecksPage from "./pages/DecksPage";
import {ErrorPage} from "./pages/ErrorPage";
import {createContext} from 'react';

export const CloseContextHome = createContext<any>([]);
export const CloseContextFolders = createContext<any>([]);

export const history = createBrowserHistory();

const App: React.FC<{}> = () => {
    const [closeCreateHome, setCloseCreateHome] = useState<boolean>(false);
    const [closeCreateFolders, setCloseCreateFolders] = useState<boolean>(false);

    const dispatch = useDispatch<AppDispatch>();

    const user = useSelector(userData);
    const status = useSelector(userStatus);
    const error = useSelector(userError);

    useEffect(() => {
        if(status === 'idle' && error.type === 'deleteUser') {
            history.push('/');
        }
    }, [error]);

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
                    <Route exact path="/" component={StartPage}/>
                    <Route exact path="/error" component={ErrorPage}/>
                    <Route exact path="/user-page" component={StartPage}/>
                    <Route path="/decks/:language" component={DecksPage}/>
                    <Route path="/profile" component={ProfilePage} />
                    <Redirect to="/" />
                </Switch>
            </>
        );
    } else {
        routes = (
            <Switch>
                <Route exact path="/" component={MainPage}/>
                <Route exact path="/error" component={ErrorPage}/>
                <Route exact path="/login" component={LoginPage}/>
                <Route exact path="/register" component={RegisterPage}/>
            </Switch>
        );
    }

    return (
        <BrowserRouter basename='/'>
            <ChakraProvider theme={theme}>
                <CloseContextHome.Provider value={[closeCreateHome, setCloseCreateHome]}>
                    <CloseContextFolders.Provider value={[closeCreateFolders, setCloseCreateFolders]}>
                    <Router history={history}>
                        {routes}
                    </Router>
                    </CloseContextFolders.Provider>
                </CloseContextHome.Provider>
            </ChakraProvider>
        </BrowserRouter>
    );
}

export default App;
