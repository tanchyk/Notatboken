import {SerializedError} from "@reduxjs/toolkit";
import {FieldInputProps, FieldMetaProps, FormikProps} from "formik";

export interface UserAuth {
    userId: number | null,
    username: string | null,
    email: string | null
}

export interface LoginData {
    usernameOrEmail: string,
    password: string
}

export interface RegisterData {
    username: string,
    email: string,
    password: string
}

export interface UserSliceType {
    user: UserAuth,
    status: string,
    error: ErrorFromServer
}

export interface CsrfSliceType {
    csrfToken: string | null
}

export interface ErrorFromServer extends Object {
    type: 'login' | 'register' | null,
    message: string | SerializedError | null
}

export interface FieldProps<V = any> {
    field: FieldInputProps<V>;
    form: FormikProps<V>;
    meta: FieldMetaProps<V>;
}

export interface BasicUser {
    name: string | null,
    email: string | null,
    username: string | null
}