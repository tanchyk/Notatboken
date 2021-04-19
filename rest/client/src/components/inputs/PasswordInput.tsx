import React, {useState} from "react";
import {FieldInputProps, FormikProps} from "formik";
import {Button, FormControl, FormErrorMessage, Input, InputGroup, InputRightElement} from "@chakra-ui/react";

interface PasswordInputProps<V = any> {
    size: 'md' | 'lg';
    name: string;
    placeholder?: string;
    field: FieldInputProps<V>;
    form: FormikProps<V>;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({size, name, placeholder, field, form}) => {
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);

    return(
        <InputGroup>
            <FormControl
                isInvalid={!!form.errors[name] && !!form.touched[name]}>
                <Input
                    {...field}
                    placeholder={placeholder ? placeholder : field.value}
                    pr="4.5rem"
                    size={size}
                    type={show ? "text" : "password"}
                />
                <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
            </FormControl>
            <InputRightElement width="4.5rem" mt={size === "lg" ? 1 : 0}>
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show ? "Hide" : "Show"}
                </Button>
            </InputRightElement>
        </InputGroup>
    );
}