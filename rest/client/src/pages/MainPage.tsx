import React from "react";
import NavBar from "../components/navigation/Navbar";
import {
    Flex,
    Stack,
    Image,
    Box,
    Heading,
    Text,
    Link,
    Button,
    useColorModeValue
} from "@chakra-ui/react";
import {Wrapper} from "../components/wrappers/Wrapper";
import {Link as LinkPage} from "react-router-dom";
import {MainWrapper} from "../components/mainPage/MainWrapper";
import {AdvantagesWrapper} from "../components/mainPage/AdvantagesWrapper";
import {Advantage} from "../components/mainPage/Advantage";

export const MainPage: React.FC = () => {
    const bgValue = useColorModeValue("#fff", "gray.700");

    return (
        <>
            <NavBar />
            <Flex bg={bgValue} justifyContent="center">
                <Wrapper variant='regular' direction="column">
                    <MainWrapper>
                        <Stack spacing={8} margin="auto" w="85%">
                            <Heading size="3xl">All you need for a perfect flashcard.</Heading>
                            <Text fontSize="2xl">This app is inspired by Gabriel Wyner method, you can read more about it here:
                                <Link ml={3} color="cyan.400" href="https://blog.fluent-forever.com/base-vocabulary-list/" isExternal>More</Link>
                            </Text>
                            <LinkPage to="/register">
                                <Button
                                    w="140px"
                                    size="lg"
                                    type="submit"
                                    variant="outline"
                                >
                                    Sign up
                                </Button>
                            </LinkPage>
                        </Stack>
                        <Box display={["none", "none", "none", "flex", "flex", "flex"]} boxSize={["300px", "340px", "400px", "440px"]} margin="auto">
                            <Image
                                src="https://res.cloudinary.com/dw3hb6ec8/image/upload/v1614424986/mainpage/1_gichqw.png"
                            />
                        </Box>
                    </MainWrapper>
                    <MainWrapper>
                        <Box boxSize={["300px", "340px", "400px", "440px"]} margin="auto">
                            <Image
                                src="https://res.cloudinary.com/dw3hb6ec8/image/upload/v1614424987/mainpage/2_f6f1ie.png"
                            />
                        </Box>
                        <Stack spacing={8} margin="auto" w="85%">
                            <Heading size="3xl">The fastest way to build your cards.</Heading>
                            <Text fontSize="2xl">
                                With Notatboken you can attach photos and context to your cards in seconds.
                            </Text>
                        </Stack>
                    </MainWrapper>
                    <AdvantagesWrapper>
                        <Advantage
                            src="https://res.cloudinary.com/dw3hb6ec8/image/upload/v1614430300/mainpage/clock_a8zs6n.png"
                            heading="Save your time"
                            text="Don't spend hours looking for content for your card, load everything you need instantly"
                        />
                        <Advantage
                            src="https://res.cloudinary.com/dw3hb6ec8/image/upload/v1614430300/mainpage/archives_lr9ciw.png"
                            heading="Orginize your cards"
                            text="Use decks and folders too keep everything in order"
                        />
                        <Advantage
                            src="https://res.cloudinary.com/dw3hb6ec8/image/upload/v1614430301/mainpage/statistics_m9xlgl.png"
                            heading="Look up your statistics"
                            text="Track your cards and how hard do you study"
                        />
                        <Advantage
                            src="https://res.cloudinary.com/dw3hb6ec8/image/upload/v1614430301/mainpage/list_bhxv8q.png"
                            heading="Keep track of your progress"
                            text="See what you have acomplished and what you need to study"
                        />
                    </AdvantagesWrapper>
                    <Flex pt={6} pb={7} justifyContent="flex-end">
                        <Heading size="md">Made with ❤ in Kharkiv © 2021 Tanchyk</Heading>
                    </Flex>
                </Wrapper>
            </Flex>
        </>
    );
}