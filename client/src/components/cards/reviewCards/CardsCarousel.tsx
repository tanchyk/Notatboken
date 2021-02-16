import React from "react";
import {useSelector} from "react-redux";
import {cardsData} from "../../../store/cardSlice";
import {Stack, Heading, Text} from "@chakra-ui/react";
import {CardBox} from "./CardBox";

interface CardsCarouselProps {
    setCardId:  React.Dispatch<React.SetStateAction<number | null>>;
}

export const CardsCarousel: React.FC<CardsCarouselProps> = ({setCardId}) => {
    const cards = useSelector(cardsData);

    return (
        <Stack
            alignItems="center"
        >
            {
                cards.length === 0 ? (
                    <Stack spacing={2} h="360px" justifyContent="center" w="60%">
                        <Heading as="h1" size="lg">No cards in this deck 😦</Heading>
                        <Text fontSize="lg">Today you have no cards to study. You can add new cards in menu near the deck name.</Text>
                    </Stack>
                ) : <CardBox card={cards[0]} setCardId={setCardId}/>
            }
        </Stack>
    );
}