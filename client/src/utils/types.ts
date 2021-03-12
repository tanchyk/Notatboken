import {SerializedError} from "@reduxjs/toolkit";
import {FieldInputProps, FieldMetaProps, FormikProps} from "formik";

//Slice Types

export interface UserSliceType {
    user: UserAuth;
    status: Status;
    error: ErrorFromServer;
}

export interface CsrfSliceType {
    csrfToken: string | null;
}

export interface DeckSliceType {
    decks: Array<DeckData>;
    status: Status;
    error: ErrorFromServer;
}

export interface FolderSliceType {
    folders: Array<FolderData>;
    status: Status;
    error: ErrorFromServer;
}

export interface CardSliceType {
    cards: Array<CardData>;
    status: Status;
    error: ErrorFromServer;
}

export interface StreakSliceType {
    streak: number | null;
    today: boolean;
}

//User types

export interface UserAuth {
    userId: number | null;
    name: string | null;
    username: string | null;
    email: string | null;
    languages: Array<LanguageData> | null;
    userGoal: number | null;
    avatar: string | null;
    createdAt: Date | null;
}

export interface BasicUser {
    name: string | null;
    email: string | null;
    username: string | null;
    avatarData: any | null;
}

export interface Passwords {
    newPassword: string;
    confirmPassword: string;
    oldPassword: string;
}

export interface LoginData {
    usernameOrEmail: string;
    password: string;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
}

//
export interface LanguageData {
    languageId: number;
    languageName: string;
}

//Deck types

export interface DeckData {
    deckId: number | null;
    deckName: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    language: LanguageData | null;
    cards: CardData[] | null;
    folder: FolderData | null;
    amountOfCards?: number | null;
}

export interface ErrorDelete extends Object {
    message: string | SerializedError | null;
    deckId: number;
}

//Folder types

export interface FolderData {
    folderId: number | null;
    folderName: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    language: LanguageData | null;
    decks: DeckData[] | null;
}

export interface ErrorDeleteFolder extends Object {
    message: string | SerializedError | null;
    folderId: number;
}

//Card types

export interface CardData {
    cardId: number | null;
    foreignWord: string | null;
    nativeWord: string | null;
    imageId: number | null;
    voiceId: number | null;
    foreignContext: string | null;
    nativeContext: string | null;
    proficiency: Proficiency | null;
    reviewDate: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    deck: DeckData | null;
}

export interface ErrorDeleteCard extends Object {
    message: string | SerializedError | null;
    cardId: number;
}

export interface ContextApi {
    from: string | null;
    to: string | null;
    phrase_from: string | null;
    phrase_to: string | null;
}

export interface CardDispatch {
    languageId: number | null,
    deckId?: number | null,
    cardId?: number | null,
    foreignWord: string | null,
    nativeWord: string | null,
    imageId: number | null,
    foreignContext: string | null,
    nativeContext: string | null
}

//Other

export type Languages  = 'Polish' | 'German' | 'Russian' | 'Norwegian' | 'Spanish' | 'French';

export type Status = 'idle' | 'succeeded' | 'failed' | 'loading';

export type Proficiency = 'fail' | 'repeat' | '1d' | '3d' | '7d' | '21d' | '31d' | '90d' | 'learned';

export interface ErrorFromServer extends Object {
    type:
        'login' | 'register' | 'confirmEmail' | 'update' | 'deleteUser'
        | 'deleteDeck' | 'notCreateDeck' | 'createDeck' | 'editDeck' | 'loadDecks'
        | 'loadCards' | 'createCard' | 'failedCreateCard' | 'editCard'
        | 'loadFolders' | 'createFolder' | 'failedCreateFolder' | 'editFolder' | 'deleteFolder' | 'failedAddDeckToFolder'
        | 'goal' | 'failGoal' | null,
    message: string | SerializedError | null
}

export interface FieldProps<V = any> {
    field: FieldInputProps<V>;
    form: FormikProps<V>;
    meta: FieldMetaProps<V>;
}

export const API_PEXELS = `${process.env.REACT_APP_API_PEXELS}`;