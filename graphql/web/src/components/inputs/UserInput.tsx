import React from "react";
import {FieldInputProps, FormikProps} from "formik";
import {FormControl, FormErrorMessage, Input} from "@chakra-ui/react";

interface UserInputProps<V = any> {
    size: 'md' | 'lg';
    name: string;
    placeholder?: string;
    field: FieldInputProps<V>;
    form: FormikProps<V>;
}

export const UserInput: React.FC<UserInputProps> = ({size, name, placeholder,field, form}) => {
    return (
        <FormControl
            isInvalid={(!!form.errors[name] && !!form.touched[name])}>
            <Input
                {...field}
                variant="outline"
                size={size}
                placeholder={placeholder ? placeholder : field.value}
                id={name}
            />
            <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
        </FormControl>
    );
}