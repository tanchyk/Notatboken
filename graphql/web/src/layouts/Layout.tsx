import React from "react";
import {Wrapper} from "../components/wrappers/Wrapper";
import {Navbar} from "../components/Navbar";
import { Flex } from "@chakra-ui/react";

interface Layout {
    variant: "regular" | "small";
}

export const Layout: React.FC<Layout> = ({children, variant="regular"}) => {
    return (
        <>
            <Navbar />
            <Flex justifyContent="center">
                <Wrapper variant={variant}>
                    {children}
                </Wrapper>
            </Flex>
        </>
    );
}