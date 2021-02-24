import React from "react";
import {Stack, useStyleConfig} from "@chakra-ui/react";

export const ProfileWrapper: React.FC<{}> = ({children}) => {
    const styleStack = useStyleConfig("Stack");
    styleStack.borderLeftWidth = "6px";

    return (
        <Stack
            sx={styleStack}
            padding={8}
            paddingLeft={10}
            marginTop={8}
            spacing={6}
        >
            {children}
        </Stack>
    );
}