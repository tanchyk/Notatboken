import React from "react";
import {Flex} from "@chakra-ui/react";

interface WrapperProps {
    variant: 'small' | 'regular',
    direction?: 'row' | 'column'
}

export const Wrapper: React.FC<WrapperProps> = ({children, variant = 'regular', direction= 'row'}) => {
    const width = variant === 'regular' ? ["90%", "90%", "80%", "70%"]:["90%", "90%", "70%", "50%"];
    return (
        <Flex direction={direction} justifyContent="space-between" width={width}>
            {children}
        </Flex>
    );
}