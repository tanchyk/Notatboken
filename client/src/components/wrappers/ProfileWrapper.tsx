import React from "react";
import {Heading, Stack, useStyleConfig} from "@chakra-ui/react";

interface ProfileWrapperProps {
    variant: 'Basic Information' | 'Change Password' | 'Delete Account'
}

export const ProfileWrapper: React.FC<ProfileWrapperProps> = ({children, variant}) => {
    const styleStack = useStyleConfig("Stack");
    styleStack.borderLeftWidth = "6px";

    return (
        <Stack
            sx={styleStack}
            padding={8}
            paddingLeft={10}
            marginTop={["0px", "0px", "30px", "30px"]}
            spacing={6}
        >
            <Heading size="lg">
                {variant}
            </Heading>
            {children}
        </Stack>
    );
}