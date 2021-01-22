import React from 'react';
import {RegisterData} from "../utils/types";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../store/store";
import {createUser} from "../store/userSlice";
import {AuthForm} from "../components/AuthForm";

//Page component
const RegisterPage: React.FC<{}> = () => {
    const dispatch = useDispatch<AppDispatch>();

    const registerHandler = async (values: RegisterData) => {
        await dispatch(createUser(values));
    }

    return (
        <AuthForm action="register" actionHandler={registerHandler} />
    );
}

export default RegisterPage;
