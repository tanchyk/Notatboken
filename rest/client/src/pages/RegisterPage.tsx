import React, {useEffect} from 'react';
import {RegisterData} from "../utils/types";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../store/store";
import {createUser, userError} from "../store/userSlice";
import {AuthForm} from "../components/AuthForm";
import {useToast} from "@chakra-ui/react";
import {history} from "../App";

//Page component
const RegisterPage: React.FC<{}> = () => {
    const toast = useToast();
    const dispatch = useDispatch<AppDispatch>();
    const error = useSelector(userError);

    const registerHandler = async (values: RegisterData) => {
        await dispatch(createUser(values));
    }

    useEffect(() => {
        if(error.type === 'confirmEmail') {
            toast({
                position: 'bottom',
                title: "Email is sent.",
                description: "Check your email for confirmation message.",
                status: "success",
                duration: 9000,
                isClosable: true,
            });
            history.push('/');
        }
    }, [error])

    return (
        <AuthForm action="register" actionHandler={registerHandler} />
    );
}

export default RegisterPage;
