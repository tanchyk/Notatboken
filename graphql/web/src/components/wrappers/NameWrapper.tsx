import React from "react";
import {Wrapper} from "./Wrapper";
import {Flex} from "@chakra-ui/react";

export const NameWrapper: React.FC<{}> = ({children}) => {
    return (
        <Flex
            justifyContent="center"
            backgroundImage="url(https://res.cloudinary.com/dw3hb6ec8/image/upload/v1614441218/app/bg-main_iuk29t.png)"
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
            paddingTop={6}
            paddingBottom={6}
            minH="141px"
        >
            <Wrapper variant="regular">
                <Flex alignItems="center" justifyContent="space-between" w="100%">
                    {children}
                </Flex>
            </Wrapper>
        </Flex>
    )
}