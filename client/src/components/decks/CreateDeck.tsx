import React, {useEffect, useRef, useState} from "react";
import {
    Stack,
    Alert,
    AlertIcon,
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Box,
    Button,
    CloseButton,
    Flex, FormControl, FormLabel,
    Heading,
    Image, Input, Text, useStyleConfig, useColorMode
} from "@chakra-ui/react";
import {useFormik} from "formik";
import {addDeck, clearDeckError, decksError, decksStatus} from "../../store/deckSlice";
import * as Yup from "yup";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../../store/store";
import {DecksHomeProps} from "./DecksHome";

export const DeckNameSchema = Yup.object().shape({
    deckName: Yup.string()
        .min(3, 'Too Short, name should be longer than 3.')
        .max(64, 'Too Long, name should be shorter than 50.')
        .required('Required')
});

interface DecksCreateProps extends DecksHomeProps {
    closeCreateComponent: () => void
}

export const CreateDeck: React.FC<DecksCreateProps> = ({language, languageId, closeCreateComponent}) => {
    const { colorMode } = useColorMode()
    const styleStack = useStyleConfig("Stack");
    styleStack.borderLeftWidth = "6px";

    const dispatch = useDispatch<AppDispatch>();
    const deckError = useSelector(decksError);
    const deckStatus = useSelector(decksStatus);

    //Create new deck
    const formikCreate = useFormik({
        initialValues: {
            deckName: '',
        },
        validationSchema: DeckNameSchema,
        onSubmit: async (values) => {
            await dispatch(clearDeckError());
            await dispatch(addDeck({deckName: values.deckName, languageId: languageId}));
        },
    });

    const [isOpen, setIsOpen] = useState(false);
    const onClose = async () => {
        await dispatch(clearDeckError());
        formikCreate.values.deckName = '';
        setIsOpen(false);
    }
    const cancelRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if(deckError.type === "createDeck") {
            onClose();
        }
    }, [deckStatus])

    return (
        <>
            <Box
                sx={styleStack}
                padding={9}
                spacing={5}
            >
                <Flex direction="row" justifyContent="space-between">
                    <Box boxSize="150px">
                        <Image
                            src="https://res.cloudinary.com/dw3hb6ec8/image/upload/v1612990212/notatboken/pen-full_pwu6cj.png"
                        />
                    </Box>
                    <Box w="60%">
                        <Heading size="lg">{`Create a study deck for the ${language} language`}</Heading>
                        <Button
                            width="140px"
                            size="lg"
                            type="submit"
                            onClick={() => setIsOpen(true)}
                            marginTop={5}
                        >
                            Create Deck
                        </Button>
                    </Box>
                    <CloseButton onClick={closeCreateComponent}/>
                </Flex>
            </Box>

            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader backgroundColor={colorMode === "light" ? "cyan.50" : "cyan.700"} borderTopRadius="lg">
                            <Heading as="h1" size="lg">
                                Create Deck
                            </Heading>
                        </AlertDialogHeader>
                        <form onSubmit={formikCreate.handleSubmit}>
                            <AlertDialogBody>
                                <Stack spacing={4} mt={4}>
                                    <Alert status={deckError.message ? "error" : "warning"}>
                                        <AlertIcon />
                                        <Text fontSize="lg">{deckError.message ? deckError.message : "Please, dont repeat your deck's name."}</Text>
                                    </Alert>
                                    <FormControl id="first-name" isRequired>
                                        <FormLabel fontSize="xl">Deck's name</FormLabel>
                                        <Input
                                            variant="outline"
                                            placeholder="Please, enter the name of the deck"
                                            size="lg"
                                            name="deckName"
                                            onChange={formikCreate.handleChange}
                                            value={formikCreate.values.deckName}
                                        />
                                        {formikCreate.errors.deckName ? <Text fontSize="lg" color="red.500" mt={3}>{formikCreate.errors.deckName}</Text> : null}
                                    </FormControl>
                                </Stack>
                            </AlertDialogBody>

                            <AlertDialogFooter>
                                <Button variant="outline" ref={cancelRef} onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button type="submit" ml={3}>
                                    Create
                                </Button>
                            </AlertDialogFooter>
                        </form>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
}