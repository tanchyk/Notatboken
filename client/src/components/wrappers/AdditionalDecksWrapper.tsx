import React, {useEffect} from "react";
import {Heading, Stack, Flex, IconButton, useStyleConfig} from "@chakra-ui/react";
import {history} from "../../App";
import {useSelector} from "react-redux";
import {decksData} from "../../store/deckSlice";
import {DeckData} from "../../utils/types";
import {BsArrowLeft} from "react-icons/all";

interface DecksWrapperProps {
    title: string;
    deckId: number;
    setDeck: React.Dispatch<React.SetStateAction<DeckData | null>>
}

export const AdditionalDecksWrapper: React.FC<DecksWrapperProps> = ({title, deckId, setDeck, children}) => {
    const styleStack = useStyleConfig("Stack");
    styleStack.borderLeftWidth = "6px";

    const goBack = async () => {
        await history.goBack();
    }

    const decks = useSelector(decksData);

    //Checking if user has this deck
    useEffect(() => {
        if(decks.length > 0) {
            let checkDeck = null;
            for(const deckTmp of decks) {
                if(deckTmp.deckId === deckId) {
                    checkDeck = deckTmp;
                    break;
                }
            }

            if(checkDeck === null) {
                history.push('/error');
            }

            setDeck(checkDeck)
        }
    }, [decks])

    return (
        <Stack
            sx={styleStack}
            marginTop={8}
            marginBottom={8}
            padding={10}
            paddingLeft={12}
        >
            <Flex
                alignItems="center"
                justifyContent="space-between"
                mb={8}
                w="75%"
            >
                <Heading as="h1" size="lg">{title}</Heading>
                <IconButton aria-label="Go Back" size="sm" icon={<BsArrowLeft />} onClick={goBack}/>
            </Flex>
            <Stack spacing={6} w="75%">
                {children}
            </Stack>
        </Stack>
    );
}