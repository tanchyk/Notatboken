import {SerializedError} from "@reduxjs/toolkit";

export interface UserAuth {
    userId: number | null,
    token: string | null
}

export interface LoginData {
    usernameOrEmail: string,
    password: string
}

export interface UserSliceType {
    user: UserAuth,
    status: string,
    error: SerializedError | null | string
}