import React from "react";
import {FieldInputProps, FormikProps} from "formik";
import {FormControl, FormErrorMessage, Input} from "@chakra-ui/react";
import {SerializedError} from "@reduxjs/toolkit";

interface UserInputProps<V = any> {
    size: 'md' | 'lg';
    name: string;
    placeholder?: string;
    message?: string | null | SerializedError;
    field: FieldInputProps<V>;
    form: FormikProps<V>;
}

export const UserInput: React.FC<UserInputProps> = ({size, name, placeholder, message, field, form}) => {
    return (
        <FormControl
            isInvalid={ !!message ? true : (!!form.errors[name] && !!form.touched[name])}>
            <Input
                {...field}
                variant="outline"
                size={size}
                placeholder={placeholder ? placeholder : field.value}
                id={name}
            />
            <FormErrorMessage>{!!message ? message : form.errors[name]}</FormErrorMessage>
        </FormControl>
    );
}