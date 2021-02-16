import React, {useState} from "react";
import {AdditionalDataBox} from "../boxes/AdditionalDataBox";
import {AiFillSound, BsFillLockFill} from "react-icons/all";
import {Select, Stack, IconButton, Flex, Tooltip} from "@chakra-ui/react";

interface ChoosePronunciationProps {
    isDisabled: boolean;
}

export const ChoosePronunciation: React.FC<ChoosePronunciationProps> = ({isDisabled}) => {
    const [showSelect, setShowSelect] = useState<boolean>(false);

    return (
        <Stack spacing={5}>
            <Flex>
                <AdditionalDataBox
                    icon={AiFillSound}
                    text="Add a pronunciation to your card?"
                    onOpen={() => setShowSelect(!showSelect)}
                    isDisabled={isDisabled}
                />
                <Tooltip label="Premium feature" fontSize="md">
                    <IconButton
                        aria-label="Premium feature"
                        size="sm"
                        ml={2}
                        bg="yellow.300"
                        _hover={{bg: "yellow.200"}}
                        icon={<BsFillLockFill/>}
                    />
                </Tooltip>
            </Flex>
            {
                showSelect ? (<Select variant="outline" placeholder="Outline" />) : null
            }
        </Stack>
    );
}