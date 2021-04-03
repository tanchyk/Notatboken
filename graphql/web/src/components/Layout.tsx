import React from "react";
import {Wrapper} from "./wrappers/Wrapper";
import {Navbar} from "./Navbar";

export const Layout: React.FC = ({children}) => {
    return (
        <>
            <Navbar />
            <Wrapper variant="regular">
                {children}
            </Wrapper>
        </>
    );
}