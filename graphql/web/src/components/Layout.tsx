import React from "react";
import {Wrapper} from "./wrappers/Wrapper";
import {Navbar} from "./Navbar";
import { Flex } from "@chakra-ui/react";

export const Layout: React.FC = ({children}) => {
    return (
        <>
            <Navbar />
            <Flex justifyContent="center">
                <Wrapper variant="regular">
                    {children}
                </Wrapper>
            </Flex>
        </>
    );
}