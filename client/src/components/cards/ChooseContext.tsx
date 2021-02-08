import React, {useState} from "react";
import {AdditionalDataBox} from "./AdditionalDataBox";
import {BiMessageAdd} from "react-icons/all";
import {Select, Stack} from "@chakra-ui/react";

interface ChooseContextProps {
    isDisabled: boolean;
}

export const ChooseContext: React.FC<ChooseContextProps> = ({isDisabled}) => {
    const [showSelect, setShowSelect] = useState<boolean>(false);

    return (
        <Stack spacing={5}>
            <AdditionalDataBox
                icon={BiMessageAdd}
                text="Attach context for a foreign word?"
                onOpen={() => setShowSelect(!showSelect)}
                isDisabled={isDisabled}
            />
            {
                showSelect ? (<Select variant="outline" placeholder="Outline" />) : null
            }
        </Stack>
    );
}