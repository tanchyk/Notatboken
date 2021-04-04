import React from "react";
import {SimpleGrid} from "@chakra-ui/react";

export const AdvantagesSection: React.FC = ({children}) => {
    return (
        <SimpleGrid
            w="100%"
            mt={9}
            mb={9}
            gap={10}
            columns={[1,1,1,1,2,2]}
            alignItems="center"
        >
            {children}
        </SimpleGrid>
    );
}