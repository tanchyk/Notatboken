import React from "react";
import {Box, useStyleConfig} from "@chakra-ui/react";

export const AppWrapper: React.FC<{}> = ({children}) => {
    const styleStack = useStyleConfig("Stack");
    styleStack.borderLeftWidth = "6px";

    return (
        <Box
            sx={styleStack}
            marginTop={8}
            marginBottom={8}
            paddingTop={8}
        >
            {children}
        </Box>
    );
}