import React, {useState} from "react";
import {AdditionalDataBox} from "./AdditionalDataBox";
import {AiFillSound} from "react-icons/all";
import {Select, Stack} from "@chakra-ui/react";

interface ChoosePronunciationProps {
    isDisabled: boolean;
}

export const ChoosePronunciation: React.FC<ChoosePronunciationProps> = ({isDisabled}) => {
    const [showSelect, setShowSelect] = useState<boolean>(false);

    return (
        <Stack spacing={5}>
            <AdditionalDataBox
                icon={AiFillSound}
                text="Add a pronunciation to your card?"
                onOpen={() => setShowSelect(!showSelect)}
                isDisabled={isDisabled}
            />
            {
                showSelect ? (<Select variant="outline" placeholder="Outline" />) : null
            }
        </Stack>
    );
}