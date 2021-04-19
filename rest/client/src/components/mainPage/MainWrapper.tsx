import React from "react";
import {SimpleGrid} from "@chakra-ui/react";

export const MainWrapper: React.FC = ({children}) => {
    return (
        <SimpleGrid
            w="100%"
            h="100vh"
            columns={[1, 1, 1, 2, 2,2]}
            alignItems="center"
        >
            {children}
        </SimpleGrid>
    );
}