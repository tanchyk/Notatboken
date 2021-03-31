import React, {useEffect, useState} from 'react';
import {ChakraProvider} from "@chakra-ui/react";
import {BrowserRouter, Redirect, Route, Router, Switch} from "react-router-dom";
import {MainPage} from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import { createBrowserHistory } from 'history';
import StartPage from "./pages/application/StartPage";
import RegisterPage from "./pages/RegisterPage";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "./store/store";
import {loadUser, userData, userError, userStatus} from "./store/userSlice";
import {fetchToken} from "./store/csrfSlice";
import NavBar from "./components/navigation/Navbar";
import {ProfilePage} from "./pages/application/ProfilePage";
import {theme} from "./utils/theme";
import DecksPage from "./pages/application/DecksPage";
import {ErrorPage} from "./pages/application/ErrorPage";
import {createContext} from 'react';
import {fetchStreak} from "./store/streakSlice";
import {StatisticsPage} from "./pages/application/StatisticsPage";
import {ChangeForgotPassword} from "./pages/ChangeForgotPassword";
import {ForgotPassword} from "./pages/ForgotPassword";
import {LoadingPage} from "./pages/LoadingPage";

export const CloseContextHome = createContext<any>([]);
export const CloseContextFolders = createContext<any>([]);
export const LanguageContext = createContext<any>([]);

export const history = createBrowserHistory();

const App: React.FC<{}> = () => {
    const [closeCreateHome, setCloseCreateHome] = useState<boolean>(false);
    const [closeCreateFolders, setCloseCreateFolders] = useState<boolean>(false);
    const [language, setLanguage] = useState<string | null>(null);

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

    useEffect(() => {
        if(status === 'succeeded') {
            dispatch(fetchStreak());
        }
    }, [status])

    let routes;

    if (!!user.userId) {
        routes = (
            <>
                <NavBar />
                <Switch>
                    <Route exact path="/" component={StartPage}/>
                    <Route exact path="/error" component={ErrorPage}/>
                    <Route path="/statistics" component={StatisticsPage}/>
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
                <Route exact path="/forgot-password" component={ForgotPassword} />
                <Route exact path="/change-forgot-password/:token" component={ChangeForgotPassword} />
            </Switch>
        );
    }

    return (
        <BrowserRouter basename='/'>
            <ChakraProvider theme={theme}>
                <CloseContextHome.Provider value={[closeCreateHome, setCloseCreateHome]}>
                    <CloseContextFolders.Provider value={[closeCreateFolders, setCloseCreateFolders]}>
                        <LanguageContext.Provider value={[language, setLanguage]}>
                            {
                                status === 'loading' && (window.location.pathname === '/' ||  window.location.pathname === '/login') ? <LoadingPage /> : (
                                    <Router history={history}>
                                        {routes}
                                    </Router>
                                )
                            }
                        </LanguageContext.Provider>
                    </CloseContextFolders.Provider>
                </CloseContextHome.Provider>
            </ChakraProvider>
        </BrowserRouter>
    );
}

export default App;
