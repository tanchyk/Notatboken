import React, { useContext } from "react";
import { LanguageLayout } from "../../../../layouts/LanguageLayout";
import { withApollo } from "../../../../utils/withApollo";
import { useRouter } from "next/router";
import {
  Flex,
  Heading,
  IconButton,
  Stack,
  Box,
  Divider,
  Skeleton,
  SimpleGrid,
  useStyleConfig,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { AppWrapper } from "../../../../components/wrappers/AppWrapper";
import { NoDataBox } from "../../../../components/NoDataBox";
import { CloseContextHome } from "../../../_app";
import { CreateForm } from "../../../../CreateForm";
import { useFindDecksQuery } from "../../../../generated/graphql";
import Custom404 from "../../../404";
import { DeckBox } from "../../../../components/decks/DeckBox";

const Decks: React.FC = () => {
  const styleProgress = useStyleConfig("Progress");

  const router = useRouter();
  const { languageId, language } = router.query;

  if (!languageId || Array.isArray(languageId)) {
    return <Custom404 />;
  }

  const { data, loading } = useFindDecksQuery({
    variables: {
      languageId: parseInt(languageId),
    },
  });

  const [closeCreate, setCloseCreate] = useContext(CloseContextHome);
  const closeCreateComponent = () => setCloseCreate(true);
  const openCreateComponent = () => setCloseCreate(false);

  return (
    <LanguageLayout>
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
              closeCreateComponent={closeCreateComponent}
              type="deck"
            />
          </Box>
        )}
        <Divider />
        <Box sx={styleProgress}>
          {loading ? (
            <Stack>
              <Skeleton height="30px" />
              <Skeleton height="30px" />
              <Skeleton height="30px" />
            </Stack>
          ) : (
            <>
              {data?.findDecks.errors || data?.findDecks.decks?.length === 0 ? (
                <NoDataBox type="decks" />
              ) : (
                <SimpleGrid columns={[1, 1, 2, 2]} spacing={4}>
                  {data?.findDecks.decks!.map((deck, key) => (
                    <DeckBox
                      deck={deck}
                      language={language as string}
                      languageId={parseInt(languageId)}
                      key={key}
                    />
                  ))}
                </SimpleGrid>
              )}
            </>
          )}
        </Box>
      </AppWrapper>
    </LanguageLayout>
  );
};

export default withApollo({ ssr: true })(Decks);
