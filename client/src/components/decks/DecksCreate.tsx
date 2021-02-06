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
    Image, Input, Text, useStyleConfig
} from "@chakra-ui/react";
import {useFormik} from "formik";
import {addDeck, clearDeckError, decksError} from "../../store/deckSlice";
import * as Yup from "yup";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../../store/store";
import {DecksHomeProps} from "./DecksHome";

const SignupSchema = Yup.object().shape({
    deckName: Yup.string()
        .min(3, 'Too Short, name should be longer than 3.')
        .max(64, 'Too Long, name should be shorter than 50.')
        .required('Required')
});

interface DecksCreateProps extends DecksHomeProps {
    closeCreateComponent: () => void
}

export const DecksCreate: React.FC<DecksCreateProps> = ({language, languageId, closeCreateComponent}) => {
    const styleStack = useStyleConfig("Stack");

    const dispatch = useDispatch<AppDispatch>();
    const deckError = useSelector(decksError);

    //Create new deck
    const formikCreate = useFormik({
        initialValues: {
            deckName: '',
        },
        validationSchema: SignupSchema,
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
        console.log(1)
        if(deckError.type === null) {
            console.log('count')
            onClose();
        }
    }, [deckError])

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
                            src="https://lh3.googleusercontent.com/Pw712TgyLqjyCoE9ljuyegTZ1XHapQI6RvrsEn5SqgZshSpIZheLPJlPcP_HtGWgQ-ss6HtzPLWeYqsNC8U-mLCoM6wxwB3_sCdbMBxioHdfQ4mhV2pT86MdV8rfXjgGlsBxINP_i32Y7Ah17WhFEi9n69AvW_sIiumxg5XTMGIAacBqHGWniR7rnNT1aNQkJLABeCgoMGSRhAS6ys0Z_NSsi2y-Z7tAd8ET_Qspf1fHW6RBWu-2cCVfEEqeHc2G99nd-27rFkf0CZErmnQTfbHMJOwflWPc72pEuANi2sSb6Rp-Kvt-cJuBWBuEPmXfI2TYuDw2i5Tn-Fuq4CSbJvDppQzznXV3mi6mKQbKNuKSfMmiMVN9wBUlXPteFACDVgVbL121FgWdCN2DsyEkW2gFwlVePfhNJN65vXhV5yoay3qPuy8hLbGk7ddzwYpoiu-F96dWtWT3MZmCLtneOzI6_YuWiAVxnZSZ4IMGoXLCN9UiYRkuBkIHfp81rPzHvSTb7_DTSdpmobXtn59AINe1sJVGN5dcsW4NjJ30IKHAetklY_HDOxw-DoFvW7HU5iwfHq2z5PF1G81bFv8LuMD5V17BQrgVu0sUi_t9sT-ejOAqu_hZ2SFlHhXLYlJ-X6ZuoLKAwkg7oQfBeMreuERvjWmqglyNyCI0zc8hXJ1fJhlFcjgAHn1hQWXu=w423-h411-no?authuser=0"/>
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
                        <AlertDialogHeader backgroundColor="blue.50" borderTopRadius="lg">
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