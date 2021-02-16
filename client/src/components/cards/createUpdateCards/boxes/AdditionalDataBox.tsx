import React from "react";
import {Flex, Icon, IconButton, Text} from "@chakra-ui/react";
import {AddIcon} from "@chakra-ui/icons";
import {IconType} from "react-icons/lib";

interface AdditionalDataBoxProps {
    icon: IconType;
    text: string;
    onOpen: () => void;
    isDisabled: boolean;
}

export const AdditionalDataBox: React.FC<AdditionalDataBoxProps> = ({icon, text, onOpen, isDisabled}) => {
    return (
        <Flex display="flex" alignItems="center">
            <Icon as={icon} boxSize="18px"/>
            <Text fontSize="lg" fontWeight="600" ml={2} mr={2}>{text}</Text>
            <IconButton aria-label={text} size="sm" icon={<AddIcon/>} onClick={onOpen} isDisabled={isDisabled}/>
        </Flex>
    );
}