import React, {useEffect, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {cardsData, cardsError} from "../../../store/cardSlice";
import {Stack, Heading, Text, useDisclosure} from "@chakra-ui/react";
import {CardBox} from "./CardBox";
import {complete} from "../../../store/streakSlice";
import {StreakNotification} from "../../decks/StreakNotification";
import {AppDispatch} from "../../../store/store";

interface CardsCarouselProps {
    setCardId:  React.Dispatch<React.SetStateAction<number | null>>;
}

export const CardsCarousel: React.FC<CardsCarouselProps> = ({setCardId}) => {
    const dispatch = useDispatch<AppDispatch>();
    const cards = useSelector(cardsData);
    const cardError = useSelector(cardsError);

    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        if(cardError.message === 'Goal Set') {
            onOpen();
            dispatch(complete());
        }
    }, [cardError])

    return (
        <>
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
            <StreakNotification isOpen={isOpen} onClose={onClose} cancelRef={cancelRef}/>
        </>
    );
}