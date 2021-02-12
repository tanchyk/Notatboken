import {SerializedError} from "@reduxjs/toolkit";
import {FieldInputProps, FieldMetaProps, FormikProps} from "formik";
import {Language} from "../../../server/entities/Language";
import {Card} from "../../../server/entities/Card";

export interface UserAuth {
    userId: number | null,
    name: string | null,
    username: string | null,
    email: string | null,
    languages: Array<Language> | null
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

export interface DeckData {
    deckId: number | null;
    deckName: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    language: Language | null;
    cards: Card[] | null;
}

export interface DeckSliceType {
    decks: Array<DeckData>;
    status: string,
    error: ErrorFromServer
}

export interface ErrorFromServer extends Object {
    type: 'login' | 'register' | 'update' | 'deleteUser' | 'deleteDeck' | 'notCreateDeck' | 'createDeck' | 'loadDecks' | null,
    message: string | SerializedError | null
}

export interface ErrorDelete extends Object {
    message: string | SerializedError | null;
    deckId: number;
}

export interface FieldProps<V = any> {
    field: FieldInputProps<V>;
    form: FormikProps<V>;
    meta: FieldMetaProps<V>;
}

export interface BasicUser {
    name: string | null;
    email: string | null;
    username: string | null;
}

export interface Passwords {
    newPassword: string;
    confirmPassword: string;
    oldPassword: string;
}

export type Languages  = 'Polish' | 'German' | 'Russian' | 'Norwegian' | 'Spanish' | 'French';

export interface ContextApi {
    from: string;
    to: string;
    phrase_from: string;
    phrase_to: string;
}