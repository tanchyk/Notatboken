import React from "react";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay, Button
} from "@chakra-ui/react";

interface AlertForDeleteProps {
    header: string;
    isOpen: boolean;
    onClose: () => void;
    onClick: () => Promise<void>;
    cancelRef: React.RefObject<HTMLButtonElement>;
}

export const AlertForDelete: React.FC<AlertForDeleteProps> = ({header, isOpen, onClose, onClick, cancelRef}) => {
    return (
        <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
        >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize="xl" fontWeight="bold">
                        {header}
                    </AlertDialogHeader>

                    <AlertDialogBody fontSize="lg">
                        Are you sure? You can't undo this action afterwards.
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button
                            ref={cancelRef}
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            colorScheme="red"
                            onClick={onClick}
                            ml={3}
                        >
                            Delete
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
}