import React from "react";
import {Wrapper} from "./Wrapper";
import {Flex} from "@chakra-ui/react";
import {StreakBox} from "../statistics/StreakBox";

export const AppWrapper: React.FC<{}> = ({children}) => {
    return (
        <Flex
            justifyContent="center"
            backgroundColor="cyan.600"
            paddingTop={8}
            paddingBottom={8}
        >
            <Wrapper variant="regular">
                <Flex alignItems="center" justifyContent="space-between" w="100%">
                    {children}
                    <StreakBox />
                </Flex>
            </Wrapper>
        </Flex>
    )
}