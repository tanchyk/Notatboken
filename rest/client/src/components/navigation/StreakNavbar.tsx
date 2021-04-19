import React, {useRef} from "react";
import {
    Button,
    Popover,
    PopoverArrow, PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverTrigger,
    Text,
    Heading,
    Stack,
    Box
} from "@chakra-ui/react";
import {FocusableElement} from "@chakra-ui/utils";
import {useSelector} from "react-redux";
import {streakData} from "../../store/streakSlice";
import {StreakBox} from "../statistics/StreakBox";

export const StreakNavbar: React.FC = () => {
    const initialFocusRef = useRef<FocusableElement>(null);

    const streak = useSelector(streakData);

    return (
        <Popover
            initialFocusRef={initialFocusRef}
            placement="bottom"
            closeOnBlur={false}
        >
            <PopoverTrigger>
                <Button variant="ghost" size="lg" w="50px">
                    {`🔥 ${streak}`}
                </Button>
            </PopoverTrigger>
            <PopoverContent p={4}>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody mt={3}>
                    <Stack direction="row" justifyContent="center" spacing={4}>
                        <Stack spacing={2}>
                            <Heading size="lg">Streak</Heading>
                            <Text fontSize="sm">Complete your goal every day to build your streak</Text>
                        </Stack>
                        <Box minW="50%">
                            <StreakBox />
                        </Box>
                    </Stack>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    )
}