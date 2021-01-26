import React from "react";
import {Flex} from "@chakra-ui/react";

interface WrapperProps {
    variant: 'small' | 'regular'
}

export const Wrapper: React.FC<WrapperProps> = ({children, variant = 'regular'}) => {
    const width = variant === 'regular' ? ["100%", "90%", "80%", "70%"]:["100%", "90%", "70%", "50%"];
    return (
        <Flex direction="row" justifyContent="space-between" width={width}>
            {children}
        </Flex>
    );
}