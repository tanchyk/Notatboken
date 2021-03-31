import React from 'react';
import {LoginData} from "../utils/types";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../store/store";
import {fetchUser} from "../store/userSlice";
import {AuthForm} from "../components/AuthForm";

//Page component
const LoginPage: React.FC<{}> = () => {
    const dispatch = useDispatch<AppDispatch>();

    const loginHandler = async (values: LoginData) => {
        await dispatch(fetchUser(values));
    }

    return (
        <AuthForm action="login" actionHandler={loginHandler} />
    );
}

export default LoginPage;
