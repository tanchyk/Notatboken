import React, {useState} from "react";
import {AdditionalDataBox} from "./AdditionalDataBox";
import {BiMessageAdd} from "react-icons/all";
import {
    Box,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Stack, Text,
    useDisclosure
} from "@chakra-ui/react";
import {useSelector} from "react-redux";
import {csrfData} from "../../store/csrfSlice";
import {ContextApi} from "../../utils/types";
import {ContextBox} from "./ContexBox";

interface ChooseContextProps {
    foreignWord: string;
    languageName?: string;
    isDisabled: boolean;
    setContext: React.Dispatch<React.SetStateAction<ContextApi | null>>;
}

export const ChooseContext: React.FC<ChooseContextProps> = ({foreignWord, languageName, isDisabled, setContext}) => {
    //Modal
    const { isOpen, onOpen, onClose } = useDisclosure();

    //Fetch context
    const [contexts, setContexts] = useState<Array<ContextApi>>();
    const [contextError, setContextError] = useState<string | null>(null);
    const csrfToken = useSelector(csrfData);

    const fetchContext = async () => {
        const response = await fetch(`/api/cards/search-context`, {
            method: 'POST',
            body: JSON.stringify({
                foreignWord,
                languageName
            }),
            headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': `${csrfToken}`
            }
        }).then(response => response.json());

        if("message" in response) {
            setContextError(response.message);
            return;
        }

        setContexts(response);
    }

    //Functions for user clicks
    const openModal = async () => {
        onOpen();
        await fetchContext();
    }

    const chooseContext = (context: ContextApi) => {
        setContext(context);
        onClose();
    }

    return (
        <>
            <AdditionalDataBox
                icon={BiMessageAdd}
                text="Attach context for a foreign word?"
                onOpen={openModal}
                isDisabled={isDisabled}
            />

            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>
                        Search for Context
                    </ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        {
                            contextError ? (<Text fontSize="xl" mb={5}>{contextError}</Text>) : (
                                <Stack direction="column" spacing={6} mb={5}>
                                    {
                                        contexts?.map((contextItem, index) => {
                                            return (
                                                <Box
                                                    onClick={() => chooseContext(contextItem)}
                                                    _hover={{cursor: "pointer"}}
                                                    _active={{
                                                        transform: "scale(0.98)",
                                                        transitionDuration: "100ms",
                                                        borderColor: "#bec3c9",
                                                    }}
                                                    key={index}
                                                >
                                                    <ContextBox
                                                        from={contextItem.from}
                                                        to={contextItem.to}
                                                    />
                                                </Box>
                                            );
                                        })
                                    }
                                </Stack>
                            )
                        }
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}