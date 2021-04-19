import React from "react";
import {Box, Heading, Stack, Image, Text, Link, Button, Flex} from "@chakra-ui/react";
import {PageSection} from "./PageSection";
import {Advantage} from "./Advantage";
import { AdvantagesSection } from "./AdvantageSection";
import NextLink from "next/link";

export const NoAuth: React.FC = () => (
    <Stack>
        <PageSection>
            <Stack spacing={8} margin="auto" w="85%">
                <Heading size="3xl">All you need for a perfect flashcard.</Heading>
                <Text fontSize="2xl">This app is inspired by Gabriel Wyner method, you can read more about it here:
                    <Link ml={3} color="cyan.400" href="https://blog.fluent-forever.com/base-vocabulary-list/"
                          isExternal>More</Link>
                </Text>
                <NextLink href="/register">
                    <Button
                        w="140px"
                        size="lg"
                        type="submit"
                        variant="outline"
                    >
                        Sign up
                    </Button>
                </NextLink>
            </Stack>
            <Box display={["none", "none", "none", "flex", "flex", "flex"]}
                 boxSize={["300px", "340px", "400px", "440px"]} margin="auto">
                <Image
                    src="https://res.cloudinary.com/dw3hb6ec8/image/upload/v1614424986/mainpage/1_gichqw.png"
                />
            </Box>
        </PageSection>
        <PageSection>
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
        </PageSection>
        <AdvantagesSection>
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
        </AdvantagesSection>
        <Flex pt={6} pb={7} justifyContent="flex-end">
            <Heading size="md">Made with ❤ in Kharkiv © 2021 Tanchyk</Heading>
        </Flex>
    </Stack>
);