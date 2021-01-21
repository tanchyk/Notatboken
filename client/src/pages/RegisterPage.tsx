import React, {useEffect} from 'react';
import {RegisterData} from "../utils/types";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../store/store";
import {createUser, userData, userError, userStatus} from "../store/userSlice";
import {history} from '../App';
import {useLogin} from "../utils/login.hook";
import {AuthForm} from "../components/AuthForm";

//Page component
const RegisterPage: React.FC<{}> = () => {
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

    const registerHandler = async (values: RegisterData) => {
        await dispatch(createUser(values));
    }

    return (
        <AuthForm action="register" actionHandler={registerHandler} message={message} />
    );
}

export default RegisterPage;
