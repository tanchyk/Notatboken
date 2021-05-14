import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type Query = {
  __typename?: 'Query';
  me?: Maybe<User>;
  findDecks: DecksResponse;
};


export type QueryFindDecksArgs = {
  languageId: Scalars['Int'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['Float'];
  name?: Maybe<Scalars['String']>;
  username: Scalars['String'];
  email: Scalars['String'];
  confirmed: Scalars['Boolean'];
  userGoal: Scalars['Float'];
  avatar: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  decks: Array<Deck>;
  daysChecked: Array<DayChecked>;
  cardsChecked: Array<CardChecked>;
  folders: Array<Folder>;
  userLanguages: Array<Language>;
};


export type Deck = {
  __typename?: 'Deck';
  deckId: Scalars['Float'];
  deckName: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  user: User;
  folder: Folder;
  language: Language;
  cards: Array<Card>;
};

export type Folder = {
  __typename?: 'Folder';
  folderId: Scalars['Float'];
  folderName: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type Language = {
  __typename?: 'Language';
  languageId: Scalars['Float'];
  languageName: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type Card = {
  __typename?: 'Card';
  cardId: Scalars['Float'];
  foreignWord: Scalars['String'];
  nativeWord: Scalars['String'];
  imageId?: Maybe<Scalars['Float']>;
  voiceId?: Maybe<Scalars['Float']>;
  foreignContext?: Maybe<Scalars['String']>;
  nativeContext?: Maybe<Scalars['String']>;
  proficiency: Scalars['String'];
  reviewDate?: Maybe<Scalars['DateTime']>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type DayChecked = {
  __typename?: 'DayChecked';
  createdAt: Scalars['DateTime'];
};

export type CardChecked = {
  __typename?: 'CardChecked';
  createdAt: Scalars['DateTime'];
};

export type DecksResponse = {
  __typename?: 'DecksResponse';
  errors?: Maybe<Array<FieldError>>;
  decks?: Maybe<Array<Deck>>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  register: EmailResponse;
  requestEmailConfirmation: EmailResponse;
  confirmRegistration: ConfirmationResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
  forgotPassword: EmailResponse;
  resetPassword: ConfirmationResponse;
  editUser: UserResponse;
  confirmEmailChange: ConfirmationResponse;
  changePassword: ConfirmationResponse;
  editGoal: ConfirmationResponse;
  deleteUser: ConfirmationResponse;
  addLanguage: AddLanguageResponse;
  addDeck: SingleDeckResponse;
  editDeck: SingleDeckResponse;
  deleteDeck: ConfirmationResponse;
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationRequestEmailConfirmationArgs = {
  email: Scalars['String'];
};


export type MutationConfirmRegistrationArgs = {
  token: Scalars['String'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationResetPasswordArgs = {
  password: Scalars['String'];
  token: Scalars['String'];
};


export type MutationEditUserArgs = {
  input: EditUserInput;
};


export type MutationConfirmEmailChangeArgs = {
  token: Scalars['String'];
};


export type MutationChangePasswordArgs = {
  oldPassword: Scalars['String'];
  newPassword: Scalars['String'];
};


export type MutationEditGoalArgs = {
  userGoal: Scalars['Int'];
};


export type MutationDeleteUserArgs = {
  password: Scalars['String'];
};


export type MutationAddLanguageArgs = {
  language: Scalars['String'];
};


export type MutationAddDeckArgs = {
  languageId: Scalars['Float'];
  deckName: Scalars['String'];
};


export type MutationEditDeckArgs = {
  languageId: Scalars['Float'];
  deckName: Scalars['String'];
  deckId: Scalars['Float'];
};


export type MutationDeleteDeckArgs = {
  deckId: Scalars['Float'];
};

export type EmailResponse = {
  __typename?: 'EmailResponse';
  errors?: Maybe<Array<FieldError>>;
  send?: Maybe<Scalars['Boolean']>;
};

export type RegisterInput = {
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
};

export type ConfirmationResponse = {
  __typename?: 'ConfirmationResponse';
  errors?: Maybe<Array<FieldError>>;
  confirmed?: Maybe<Scalars['Boolean']>;
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type LoginInput = {
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
};

export type EditUserInput = {
  name?: Maybe<Scalars['String']>;
  username: Scalars['String'];
  email: Scalars['String'];
  avatarData?: Maybe<Scalars['String']>;
};

export type AddLanguageResponse = {
  __typename?: 'AddLanguageResponse';
  errors?: Maybe<Array<FieldError>>;
  languageId?: Maybe<Scalars['Int']>;
};

export type SingleDeckResponse = {
  __typename?: 'SingleDeckResponse';
  errors?: Maybe<Array<FieldError>>;
  deck?: Maybe<Deck>;
};

export type ErrorFragment = (
  { __typename?: 'FieldError' }
  & Pick<FieldError, 'field' | 'message'>
);

export type RegularDeckFragment = (
  { __typename?: 'Deck' }
  & Pick<Deck, 'deckId' | 'deckName'>
);

export type RegularUserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'name' | 'username' | 'email' | 'userGoal' | 'avatar' | 'createdAt'>
  & { userLanguages: Array<(
    { __typename?: 'Language' }
    & Pick<Language, 'languageId' | 'languageName'>
  )> }
);

export type AddLanguageMutationVariables = Exact<{
  language: Scalars['String'];
}>;


export type AddLanguageMutation = (
  { __typename?: 'Mutation' }
  & { addLanguage: (
    { __typename?: 'AddLanguageResponse' }
    & Pick<AddLanguageResponse, 'languageId'>
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & ErrorFragment
    )>> }
  ) }
);

export type ChangePasswordMutationVariables = Exact<{
  newPassword: Scalars['String'];
  oldPassword: Scalars['String'];
}>;


export type ChangePasswordMutation = (
  { __typename?: 'Mutation' }
  & { changePassword: (
    { __typename?: 'ConfirmationResponse' }
    & Pick<ConfirmationResponse, 'confirmed'>
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & ErrorFragment
    )>> }
  ) }
);

export type ConfirmEmailChangeMutationVariables = Exact<{
  token: Scalars['String'];
}>;


export type ConfirmEmailChangeMutation = (
  { __typename?: 'Mutation' }
  & { confirmEmailChange: (
    { __typename?: 'ConfirmationResponse' }
    & Pick<ConfirmationResponse, 'confirmed'>
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & ErrorFragment
    )>> }
  ) }
);

export type ConfirmRegistrationMutationVariables = Exact<{
  token: Scalars['String'];
}>;


export type ConfirmRegistrationMutation = (
  { __typename?: 'Mutation' }
  & { confirmRegistration: (
    { __typename?: 'ConfirmationResponse' }
    & Pick<ConfirmationResponse, 'confirmed'>
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & ErrorFragment
    )>> }
  ) }
);

export type DeleteAccountMutationVariables = Exact<{
  password: Scalars['String'];
}>;


export type DeleteAccountMutation = (
  { __typename?: 'Mutation' }
  & { deleteUser: (
    { __typename?: 'ConfirmationResponse' }
    & Pick<ConfirmationResponse, 'confirmed'>
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & ErrorFragment
    )>> }
  ) }
);

export type EditGoalMutationVariables = Exact<{
  userGoal: Scalars['Int'];
}>;


export type EditGoalMutation = (
  { __typename?: 'Mutation' }
  & { editGoal: (
    { __typename?: 'ConfirmationResponse' }
    & Pick<ConfirmationResponse, 'confirmed'>
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & ErrorFragment
    )>> }
  ) }
);

export type EditUserMutationVariables = Exact<{
  input: EditUserInput;
}>;


export type EditUserMutation = (
  { __typename?: 'Mutation' }
  & { editUser: (
    { __typename?: 'UserResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & ErrorFragment
    )>>, user?: Maybe<(
      { __typename?: 'User' }
      & RegularUserFragment
    )> }
  ) }
);

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = (
  { __typename?: 'Mutation' }
  & { forgotPassword: (
    { __typename?: 'EmailResponse' }
    & Pick<EmailResponse, 'send'>
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & ErrorFragment
    )>> }
  ) }
);

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & { user?: Maybe<(
      { __typename?: 'User' }
      & RegularUserFragment
    )>, errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & ErrorFragment
    )>> }
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type RegisterMutationVariables = Exact<{
  input: RegisterInput;
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'EmailResponse' }
    & Pick<EmailResponse, 'send'>
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & ErrorFragment
    )>> }
  ) }
);

export type RequestEmailConfirmationMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type RequestEmailConfirmationMutation = (
  { __typename?: 'Mutation' }
  & { requestEmailConfirmation: (
    { __typename?: 'EmailResponse' }
    & Pick<EmailResponse, 'send'>
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & ErrorFragment
    )>> }
  ) }
);

export type ResetPasswordMutationVariables = Exact<{
  token: Scalars['String'];
  password: Scalars['String'];
}>;


export type ResetPasswordMutation = (
  { __typename?: 'Mutation' }
  & { resetPassword: (
    { __typename?: 'ConfirmationResponse' }
    & Pick<ConfirmationResponse, 'confirmed'>
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & ErrorFragment
    )>> }
  ) }
);

export type FindDecksQueryVariables = Exact<{
  languageId: Scalars['Int'];
}>;


export type FindDecksQuery = (
  { __typename?: 'Query' }
  & { findDecks: (
    { __typename?: 'DecksResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & ErrorFragment
    )>>, decks?: Maybe<Array<(
      { __typename?: 'Deck' }
      & RegularDeckFragment
    )>> }
  ) }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & RegularUserFragment
  )> }
);

export const ErrorFragmentDoc = gql`
    fragment Error on FieldError {
  field
  message
}
    `;
export const RegularDeckFragmentDoc = gql`
    fragment RegularDeck on Deck {
  deckId
  deckName
}
    `;
export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  name
  username
  email
  userGoal
  avatar
  createdAt
  userLanguages {
    languageId
    languageName
  }
}
    `;
export const AddLanguageDocument = gql`
    mutation AddLanguage($language: String!) {
  addLanguage(language: $language) {
    errors {
      ...Error
    }
    languageId
  }
}
    ${ErrorFragmentDoc}`;
export type AddLanguageMutationFn = Apollo.MutationFunction<AddLanguageMutation, AddLanguageMutationVariables>;

/**
 * __useAddLanguageMutation__
 *
 * To run a mutation, you first call `useAddLanguageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddLanguageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addLanguageMutation, { data, loading, error }] = useAddLanguageMutation({
 *   variables: {
 *      language: // value for 'language'
 *   },
 * });
 */
export function useAddLanguageMutation(baseOptions?: Apollo.MutationHookOptions<AddLanguageMutation, AddLanguageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddLanguageMutation, AddLanguageMutationVariables>(AddLanguageDocument, options);
      }
export type AddLanguageMutationHookResult = ReturnType<typeof useAddLanguageMutation>;
export type AddLanguageMutationResult = Apollo.MutationResult<AddLanguageMutation>;
export type AddLanguageMutationOptions = Apollo.BaseMutationOptions<AddLanguageMutation, AddLanguageMutationVariables>;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($newPassword: String!, $oldPassword: String!) {
  changePassword(newPassword: $newPassword, oldPassword: $oldPassword) {
    errors {
      ...Error
    }
    confirmed
  }
}
    ${ErrorFragmentDoc}`;
export type ChangePasswordMutationFn = Apollo.MutationFunction<ChangePasswordMutation, ChangePasswordMutationVariables>;

/**
 * __useChangePasswordMutation__
 *
 * To run a mutation, you first call `useChangePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePasswordMutation, { data, loading, error }] = useChangePasswordMutation({
 *   variables: {
 *      newPassword: // value for 'newPassword'
 *      oldPassword: // value for 'oldPassword'
 *   },
 * });
 */
export function useChangePasswordMutation(baseOptions?: Apollo.MutationHookOptions<ChangePasswordMutation, ChangePasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument, options);
      }
export type ChangePasswordMutationHookResult = ReturnType<typeof useChangePasswordMutation>;
export type ChangePasswordMutationResult = Apollo.MutationResult<ChangePasswordMutation>;
export type ChangePasswordMutationOptions = Apollo.BaseMutationOptions<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const ConfirmEmailChangeDocument = gql`
    mutation ConfirmEmailChange($token: String!) {
  confirmEmailChange(token: $token) {
    errors {
      ...Error
    }
    confirmed
  }
}
    ${ErrorFragmentDoc}`;
export type ConfirmEmailChangeMutationFn = Apollo.MutationFunction<ConfirmEmailChangeMutation, ConfirmEmailChangeMutationVariables>;

/**
 * __useConfirmEmailChangeMutation__
 *
 * To run a mutation, you first call `useConfirmEmailChangeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useConfirmEmailChangeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [confirmEmailChangeMutation, { data, loading, error }] = useConfirmEmailChangeMutation({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useConfirmEmailChangeMutation(baseOptions?: Apollo.MutationHookOptions<ConfirmEmailChangeMutation, ConfirmEmailChangeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ConfirmEmailChangeMutation, ConfirmEmailChangeMutationVariables>(ConfirmEmailChangeDocument, options);
      }
export type ConfirmEmailChangeMutationHookResult = ReturnType<typeof useConfirmEmailChangeMutation>;
export type ConfirmEmailChangeMutationResult = Apollo.MutationResult<ConfirmEmailChangeMutation>;
export type ConfirmEmailChangeMutationOptions = Apollo.BaseMutationOptions<ConfirmEmailChangeMutation, ConfirmEmailChangeMutationVariables>;
export const ConfirmRegistrationDocument = gql`
    mutation ConfirmRegistration($token: String!) {
  confirmRegistration(token: $token) {
    errors {
      ...Error
    }
    confirmed
  }
}
    ${ErrorFragmentDoc}`;
export type ConfirmRegistrationMutationFn = Apollo.MutationFunction<ConfirmRegistrationMutation, ConfirmRegistrationMutationVariables>;

/**
 * __useConfirmRegistrationMutation__
 *
 * To run a mutation, you first call `useConfirmRegistrationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useConfirmRegistrationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [confirmRegistrationMutation, { data, loading, error }] = useConfirmRegistrationMutation({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useConfirmRegistrationMutation(baseOptions?: Apollo.MutationHookOptions<ConfirmRegistrationMutation, ConfirmRegistrationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ConfirmRegistrationMutation, ConfirmRegistrationMutationVariables>(ConfirmRegistrationDocument, options);
      }
export type ConfirmRegistrationMutationHookResult = ReturnType<typeof useConfirmRegistrationMutation>;
export type ConfirmRegistrationMutationResult = Apollo.MutationResult<ConfirmRegistrationMutation>;
export type ConfirmRegistrationMutationOptions = Apollo.BaseMutationOptions<ConfirmRegistrationMutation, ConfirmRegistrationMutationVariables>;
export const DeleteAccountDocument = gql`
    mutation DeleteAccount($password: String!) {
  deleteUser(password: $password) {
    errors {
      ...Error
    }
    confirmed
  }
}
    ${ErrorFragmentDoc}`;
export type DeleteAccountMutationFn = Apollo.MutationFunction<DeleteAccountMutation, DeleteAccountMutationVariables>;

/**
 * __useDeleteAccountMutation__
 *
 * To run a mutation, you first call `useDeleteAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAccountMutation, { data, loading, error }] = useDeleteAccountMutation({
 *   variables: {
 *      password: // value for 'password'
 *   },
 * });
 */
export function useDeleteAccountMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAccountMutation, DeleteAccountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAccountMutation, DeleteAccountMutationVariables>(DeleteAccountDocument, options);
      }
export type DeleteAccountMutationHookResult = ReturnType<typeof useDeleteAccountMutation>;
export type DeleteAccountMutationResult = Apollo.MutationResult<DeleteAccountMutation>;
export type DeleteAccountMutationOptions = Apollo.BaseMutationOptions<DeleteAccountMutation, DeleteAccountMutationVariables>;
export const EditGoalDocument = gql`
    mutation EditGoal($userGoal: Int!) {
  editGoal(userGoal: $userGoal) {
    errors {
      ...Error
    }
    confirmed
  }
}
    ${ErrorFragmentDoc}`;
export type EditGoalMutationFn = Apollo.MutationFunction<EditGoalMutation, EditGoalMutationVariables>;

/**
 * __useEditGoalMutation__
 *
 * To run a mutation, you first call `useEditGoalMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditGoalMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editGoalMutation, { data, loading, error }] = useEditGoalMutation({
 *   variables: {
 *      userGoal: // value for 'userGoal'
 *   },
 * });
 */
export function useEditGoalMutation(baseOptions?: Apollo.MutationHookOptions<EditGoalMutation, EditGoalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditGoalMutation, EditGoalMutationVariables>(EditGoalDocument, options);
      }
export type EditGoalMutationHookResult = ReturnType<typeof useEditGoalMutation>;
export type EditGoalMutationResult = Apollo.MutationResult<EditGoalMutation>;
export type EditGoalMutationOptions = Apollo.BaseMutationOptions<EditGoalMutation, EditGoalMutationVariables>;
export const EditUserDocument = gql`
    mutation EditUser($input: EditUserInput!) {
  editUser(input: $input) {
    errors {
      ...Error
    }
    user {
      ...RegularUser
    }
  }
}
    ${ErrorFragmentDoc}
${RegularUserFragmentDoc}`;
export type EditUserMutationFn = Apollo.MutationFunction<EditUserMutation, EditUserMutationVariables>;

/**
 * __useEditUserMutation__
 *
 * To run a mutation, you first call `useEditUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editUserMutation, { data, loading, error }] = useEditUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEditUserMutation(baseOptions?: Apollo.MutationHookOptions<EditUserMutation, EditUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditUserMutation, EditUserMutationVariables>(EditUserDocument, options);
      }
export type EditUserMutationHookResult = ReturnType<typeof useEditUserMutation>;
export type EditUserMutationResult = Apollo.MutationResult<EditUserMutation>;
export type EditUserMutationOptions = Apollo.BaseMutationOptions<EditUserMutation, EditUserMutationVariables>;
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email) {
    send
    errors {
      ...Error
    }
  }
}
    ${ErrorFragmentDoc}`;
export type ForgotPasswordMutationFn = Apollo.MutationFunction<ForgotPasswordMutation, ForgotPasswordMutationVariables>;

/**
 * __useForgotPasswordMutation__
 *
 * To run a mutation, you first call `useForgotPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useForgotPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [forgotPasswordMutation, { data, loading, error }] = useForgotPasswordMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useForgotPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument, options);
      }
export type ForgotPasswordMutationHookResult = ReturnType<typeof useForgotPasswordMutation>;
export type ForgotPasswordMutationResult = Apollo.MutationResult<ForgotPasswordMutation>;
export type ForgotPasswordMutationOptions = Apollo.BaseMutationOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>;
export const LoginDocument = gql`
    mutation Login($input: LoginInput!) {
  login(input: $input) {
    user {
      ...RegularUser
    }
    errors {
      ...Error
    }
  }
}
    ${RegularUserFragmentDoc}
${ErrorFragmentDoc}`;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($input: RegisterInput!) {
  register(input: $input) {
    send
    errors {
      ...Error
    }
  }
}
    ${ErrorFragmentDoc}`;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const RequestEmailConfirmationDocument = gql`
    mutation RequestEmailConfirmation($email: String!) {
  requestEmailConfirmation(email: $email) {
    send
    errors {
      ...Error
    }
  }
}
    ${ErrorFragmentDoc}`;
export type RequestEmailConfirmationMutationFn = Apollo.MutationFunction<RequestEmailConfirmationMutation, RequestEmailConfirmationMutationVariables>;

/**
 * __useRequestEmailConfirmationMutation__
 *
 * To run a mutation, you first call `useRequestEmailConfirmationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRequestEmailConfirmationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [requestEmailConfirmationMutation, { data, loading, error }] = useRequestEmailConfirmationMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useRequestEmailConfirmationMutation(baseOptions?: Apollo.MutationHookOptions<RequestEmailConfirmationMutation, RequestEmailConfirmationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RequestEmailConfirmationMutation, RequestEmailConfirmationMutationVariables>(RequestEmailConfirmationDocument, options);
      }
export type RequestEmailConfirmationMutationHookResult = ReturnType<typeof useRequestEmailConfirmationMutation>;
export type RequestEmailConfirmationMutationResult = Apollo.MutationResult<RequestEmailConfirmationMutation>;
export type RequestEmailConfirmationMutationOptions = Apollo.BaseMutationOptions<RequestEmailConfirmationMutation, RequestEmailConfirmationMutationVariables>;
export const ResetPasswordDocument = gql`
    mutation ResetPassword($token: String!, $password: String!) {
  resetPassword(token: $token, password: $password) {
    errors {
      ...Error
    }
    confirmed
  }
}
    ${ErrorFragmentDoc}`;
export type ResetPasswordMutationFn = Apollo.MutationFunction<ResetPasswordMutation, ResetPasswordMutationVariables>;

/**
 * __useResetPasswordMutation__
 *
 * To run a mutation, you first call `useResetPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetPasswordMutation, { data, loading, error }] = useResetPasswordMutation({
 *   variables: {
 *      token: // value for 'token'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useResetPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ResetPasswordMutation, ResetPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(ResetPasswordDocument, options);
      }
export type ResetPasswordMutationHookResult = ReturnType<typeof useResetPasswordMutation>;
export type ResetPasswordMutationResult = Apollo.MutationResult<ResetPasswordMutation>;
export type ResetPasswordMutationOptions = Apollo.BaseMutationOptions<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const FindDecksDocument = gql`
    query FindDecks($languageId: Int!) {
  findDecks(languageId: $languageId) {
    errors {
      ...Error
    }
    decks {
      ...RegularDeck
    }
  }
}
    ${ErrorFragmentDoc}
${RegularDeckFragmentDoc}`;

/**
 * __useFindDecksQuery__
 *
 * To run a query within a React component, call `useFindDecksQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindDecksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindDecksQuery({
 *   variables: {
 *      languageId: // value for 'languageId'
 *   },
 * });
 */
export function useFindDecksQuery(baseOptions: Apollo.QueryHookOptions<FindDecksQuery, FindDecksQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindDecksQuery, FindDecksQueryVariables>(FindDecksDocument, options);
      }
export function useFindDecksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindDecksQuery, FindDecksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindDecksQuery, FindDecksQueryVariables>(FindDecksDocument, options);
        }
export type FindDecksQueryHookResult = ReturnType<typeof useFindDecksQuery>;
export type FindDecksLazyQueryHookResult = ReturnType<typeof useFindDecksLazyQuery>;
export type FindDecksQueryResult = Apollo.QueryResult<FindDecksQuery, FindDecksQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;