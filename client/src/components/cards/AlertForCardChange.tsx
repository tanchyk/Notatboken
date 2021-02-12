import React from "react";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay, Button
} from "@chakra-ui/react";
import {CardData} from "../../utils/types";
import {Formik} from "formik";

interface AlertForCardChangeProps {
    card: CardData;
    isOpen: boolean;
    onClose: () => void;
    cancelRef: React.RefObject<HTMLButtonElement>;
}

export const AlertForCardChange: React.FC<AlertForCardChangeProps> = ({card, isOpen, onClose, cancelRef}) => {
    return (
        <Formik
            initialValues={{
                foreignWord: '',
                nativeWord: '',
            }}
            onSubmit={async (values) => {
                console.log(values);
            }}
        >
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="2xl" fontWeight="bold">
                            Edit Card 📝
                        </AlertDialogHeader>

                        <AlertDialogBody fontSize="lg">
                            {card.foreignWord}
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button
                                variant="outline"
                                ref={cancelRef}
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                // onClick={onClick}
                                ml={3}
                            >
                                Edit
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Formik>
    );
}