import React, {useEffect} from 'react';
import {LoginData} from "../utils/types";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../store/store";
import {fetchUser, userData, userError, userStatus} from "../store/userSlice";
import {history} from '../App';
import {useLogin} from "../utils/login.hook";
import {AuthForm} from "../components/AuthForm";

//Page component
const LoginPage: React.FC<{}> = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {login} = useLogin();

    const user = useSelector(userData);
    const status = useSelector(userStatus);
    const errorMessage = useSelector(userError);
    let message: string | null | undefined = null;

    useEffect(() => {
        if(status === 'succeeded') {
            login(user.userId);
            history.push('/');
        } else  if(status === 'failed' && errorMessage) {
            message = errorMessage.message;
        }
    }, [user, errorMessage]);

    const loginHandler = async (values: LoginData) => {
        await dispatch(fetchUser(values));
    }

    return (
        <AuthForm action="login" actionHandler={loginHandler} message={message} />
    );
}

export default LoginPage;
