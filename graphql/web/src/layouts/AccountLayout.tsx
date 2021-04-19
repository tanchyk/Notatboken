import React from "react";
import {NavProfile} from "../components/navigation/NavProfile";
import {useStyleConfig, Stack,Box} from "@chakra-ui/react";

export const AccountLayout: React.FC = ({children}) => {
    const styleStack = useStyleConfig("Stack");

    return (
        <>
            <Stack
                sx={styleStack}
                w={["100%", "100%", "35%", "35%", "35%", "27%"]}
                display={["none", "none", "flex", "flex", "flex", "flex"]}
                paddingTop={8}
                paddingBottom={8}
                my={8}
                maxH="241.2px"
            >
                <NavProfile />
            </Stack>
            <Box w={["100%", "100%", "60%", "60%", "60%", "70%"]}>
                {children}
            </Box>
        </>
    );
}