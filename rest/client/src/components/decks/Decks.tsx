import React, { useContext, useEffect } from "react";
import {
  Box,
  Flex,
  Heading,
  SimpleGrid,
  IconButton,
  useStyleConfig,
  Divider,
  Skeleton,
  Stack,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { Languages } from "../../utils/types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { decksData, clearDecks, decksStatus } from "../../store/deckSlice";
import { DeckBox } from "./boxes/DeckBox";
import { NoDataBox } from "../NoDataBox";
import { CloseContextHome } from "../../App";
import { AppWrapper } from "../wrappers/AppWrapper";
import { CreateForm } from "../CreateForm";

export interface DecksHomeProps {
  language: Languages;
  languageId: number;
}

export const Decks: React.FC<DecksHomeProps> = ({ language, languageId }) => {
  const styleProgress = useStyleConfig("Progress");

  const [closeCreate, setCloseCreate] = useContext(CloseContextHome);
  const closeCreateComponent = () => setCloseCreate(true);
  const openCreateComponent = () => setCloseCreate(false);

  //Load Decks
  const dispatch = useDispatch<AppDispatch>();
  const decks = useSelector(decksData);
  const deckStatus = useSelector(decksStatus);

  useEffect(() => {
    if (decks.length > 0 && decks[0]?.language?.languageId !== languageId) {
      dispatch(clearDecks());
    }
  }, []);

  return (
    <AppWrapper>
      <Flex>
        <Heading size="lg" ml={10} mb={6}>
          Decks
        </Heading>
        {closeCreate ? (
          <IconButton
            ml={3}
            aria-label="Close create deck"
            size="md"
            icon={<AddIcon />}
            onClick={openCreateComponent}
          />
        ) : null}
      </Flex>
      {closeCreate ? null : (
        <Box p={10} pt={0}>
          <CreateForm
            language={language}
            languageId={languageId}
            closeCreateComponent={closeCreateComponent}
            type="deck"
          />
        </Box>
      )}
      <Divider />
      <Box sx={styleProgress}>
        {deckStatus === "loading" && decks.length === 0 ? (
          <Stack>
            <Skeleton height="30px" />
            <Skeleton height="30px" />
            <Skeleton height="30px" />
          </Stack>
        ) : (
          <>
            {decks.length === 0 ? (
              <NoDataBox type="decks" />
            ) : (
              <SimpleGrid columns={[1, 1, 2, 2]} spacing={4}>
                {decks.map((deck, key) => (
                  <DeckBox deck={deck} key={key} />
                ))}
              </SimpleGrid>
            )}
          </>
        )}
      </Box>
    </AppWrapper>
  );
};
