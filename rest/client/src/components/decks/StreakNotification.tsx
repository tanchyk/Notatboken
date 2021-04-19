import React, {MutableRefObject} from "react";
import {
    AlertDialog, AlertDialogBody,
    AlertDialogCloseButton,
    AlertDialogContent, AlertDialogFooter,
    AlertDialogOverlay, Box,
    Button, Flex, Heading, Image,
    SimpleGrid, Stack, Text
} from "@chakra-ui/react";

interface StreakNotificationProps {
    isOpen: boolean;
    onClose: () => void;
    cancelRef: MutableRefObject<HTMLButtonElement | null>;
}

export const StreakNotification: React.FC<StreakNotificationProps> = ({isOpen, onClose, cancelRef}) => {
    return (
        <AlertDialog
            motionPreset="slideInBottom"
            leastDestructiveRef={cancelRef}
            onClose={onClose}
            isOpen={isOpen}
            size="2xl"
            isCentered
        >
            <AlertDialogOverlay />

            <AlertDialogContent>
                <AlertDialogCloseButton />
                <AlertDialogBody fontSize="xl">
                    <SimpleGrid columns={[1,1,2,2,2,2]} padding={6} mt={8}>
                        <Flex alignItems="center" justifyContent="center" mb={[8,8,0,0,0,0]}>
                            <Box boxSize={["160px","180px", "200px", "200px"]}>
                                <Image
                                    src="https://res.cloudinary.com/dw3hb6ec8/image/upload/v1614173798/notatboken/goal_cssnef.png"
                                />
                            </Box>
                        </Flex>
                        <Flex alignItems="center" justifyContent="center">
                            <Stack spacing={5} w="80%">
                                <Heading size="lg">You did it 🥳</Heading>
                                <Text fontSize="xl">You have just completed your daily goal for today, good job!</Text>
                            </Stack>
                        </Flex>
                    </SimpleGrid>
                </AlertDialogBody>
                <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose} size="lg">
                        Back to learning
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}