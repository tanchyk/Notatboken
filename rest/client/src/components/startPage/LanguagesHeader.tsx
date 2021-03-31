import React from "react";
import {Flex, Heading} from "@chakra-ui/react";
import {ProgressBar} from "../statistics/ProgressBar";

export const LanguagesHeader: React.FC = () => {
    return (
        <Flex direction="row" justifyContent="space-between">
            <Heading as="h1" size="lg">Welcome to Notatboken</Heading>
            <ProgressBar type="circle" />
        </Flex>
    );
}