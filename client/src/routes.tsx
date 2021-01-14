import React from "react";
import {Switch, Route, Redirect } from 'react-router-dom';

export const Routes: React.FC = () => {
    const isAuth = false;

    if(isAuth) {
        return (
            <Switch>
                <Route exact path="/notes">

                </Route>
                <Route exact path="/profile">

                </Route>
                <Redirect to="/notes" />
            </Switch>
        );
    } else {
        return  (
            <Switch>
                <Route path="/">

                </Route>
                <Route path="/login">

                </Route>
                <Route path="/register">

                </Route>
                <Redirect to="/" />
            </Switch>
        );
    }
}