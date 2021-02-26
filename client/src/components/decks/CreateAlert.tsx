import React, {useEffect, useRef} from "react";
import {
    Alert, AlertDialog,
    AlertDialogBody,
    AlertDialogContent, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay, AlertIcon, Button, FormControl, FormLabel,
    Heading, Input,
    Stack, Text, useColorMode
} from "@chakra-ui/react";
import {useFormik} from "formik";
import {addDeck, clearDeckError, decksError} from "../../store/deckSlice";
import {DeckNameSchema} from "./CreateDeck";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../../store/store";

interface CreateAlertProps {
    isOpen: boolean;
    setIsOpen:  React.Dispatch<React.SetStateAction<boolean>>;
    languageId: number;
}

export const CreateAlert: React.FC<CreateAlertProps> = ({isOpen, setIsOpen, languageId}) => {
    const { colorMode } = useColorMode();

    const dispatch = useDispatch<AppDispatch>();
    const deckError = useSelector(decksError);

    //Create new deck
    const formikCreate = useFormik({
        initialValues: {
            deckName: '',
        },
        validationSchema: DeckNameSchema,
        onSubmit: async (values) => {
            await dispatch(clearDeckError());
            await dispatch(addDeck({deckName: values.deckName, languageId}));
        },
    });

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
    }, [deckError])

    return (
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
    );
}