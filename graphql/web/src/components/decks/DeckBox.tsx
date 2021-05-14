import { useStyleConfig, Box, Flex, Heading, Text } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { RegularDeckFragment, useMeQuery } from "../../generated/graphql";
import { DeckMenu } from "./DeckMenu";

export interface DeckBoxProps {
  deck: RegularDeckFragment & { amountOfCards?: number };
  language: string;
  languageId: number;
}

export const DeckBox: React.FC<DeckBoxProps> = ({
  deck,
  language,
  languageId,
}) => {
  const styleStack = useStyleConfig("Stack");
  const bgText = useStyleConfig("BgText");

  const { data } = useMeQuery();

  return (
    <NextLink href={`/${language}/${languageId}/review/${deck.deckId}`}>
      <Box
        sx={styleStack}
        h="150px"
        padding={5}
        paddingTop={7}
        _hover={{
          paddingBottom: "11.5px",
          borderBottomWidth: "6px",
        }}
      >
        <Flex direction="column" justifyContent="space-between" h="100%">
          <Box>
            <Heading as="h1" fontSize="21px">
              {deck.deckName}
            </Heading>
            {deck.amountOfCards && (
              <Text sx={bgText}>{`${deck.amountOfCards} cards`}</Text>
            )}
          </Box>
          <Flex justifyContent="space-between">
            <Text fontSize="16px">{data?.me?.username}</Text>
            <Box onClick={(event: React.MouseEvent) => event.preventDefault()}>
              <DeckMenu
                deck={deck}
                language={language}
                languageId={languageId}
              />
            </Box>
          </Flex>
        </Flex>
      </Box>
    </NextLink>
  );
};
