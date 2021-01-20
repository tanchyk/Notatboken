import {SerializedError} from "@reduxjs/toolkit";

export interface UserAuth {
    userId: number | null,
    username: string | null,
    email: string | null
}

export interface LoginData {
    usernameOrEmail: string,
    password: string
}

export interface UserSliceType {
    user: UserAuth,
    status: string,
    error: SerializedError | null | ErrorFromServer
}

export interface ErrorFromServer extends Object {
    message: string
}