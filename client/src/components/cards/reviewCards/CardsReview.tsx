import React, {useEffect, useRef} from "react";
import {Link as LinkPage} from "react-router-dom";
import {Stack, Heading, IconButton, Flex} from "@chakra-ui/react";
import {AdditionalDeckInfProps} from "../createUpdateCards/CreateCard";
import {clearDeckError, decksStatus, singleDeck} from "../../../store/deckSlice";
import {useDispatch, useSelector} from "react-redux";
import {BsArrowLeft, MdDelete} from "react-icons/all";
import {history} from "../../../App";
import {DeckSliceType} from "../../../utils/types";
import {DeckMenu} from "../../decks/DeckMenu";
import {EditIcon} from "@chakra-ui/icons";
import {CardsCarousel} from "./CardsCarousel";
import {cardsData, clearCards, deleteCard, fetchCardsForReview} from "../../../store/cardSlice";
import {AppDispatch} from "../../../store/store";
import {AlertForDelete} from "../../AlertForDelete";

export const CardsReview: React.FC<AdditionalDeckInfProps> = ({match}) => {
    const deckId = Number.parseInt(match.params.deckId);

    const cardIdRef = useRef<number | null>(null);

    //Delete card
    const [isOpen, setIsOpen] = React.useState(false);
    const onClose = () => setIsOpen(false);
    const cancelRef = useRef<HTMLButtonElement>(null);

    const goBack = async () => {
        await history.goBack();
    }

    const deleteHandler = async () => {
        if(cardIdRef.current) {
            await dispatch(deleteCard({cardId: cardIdRef.current}))
        }
        onClose();
    }

    const dispatch = useDispatch<AppDispatch>();
    const cards = useSelector(cardsData);
    const deck = useSelector((state: {decks: DeckSliceType}) => singleDeck(state, deckId));
    const deckStatus = useSelector(decksStatus);

    useEffect(() => {
        if(deck === undefined && deckStatus === 'succeeded') {
            history.push('/error');
        }
    }, [deckStatus])

    useEffect(() => {
        dispatch(clearCards());
        dispatch(clearDeckError());
        dispatch(fetchCardsForReview({deckId: deckId}));
    }, [])

    return (
        <Stack
            spacing={8}
            marginTop={8}
            marginBottom={1}
            padding={6}
            borderWidth="1px"
            borderRadius="lg"
            minH="438.2px"
        >
            <Flex
                alignItems="center"
                justifyContent="space-between"
            >
                <Flex direction="row">
                    <Heading as="h1" size="lg" mr={3} fontWeight="600">Deck: </Heading>
                    <Heading as="h1" size="lg" mr={3} fontWeight="700">{deck?.deckName}</Heading>
                    {
                        deck ? <DeckMenu deck={deck}/> : null
                    }
                </Flex>
                <Flex direction="row">
                    {
                        cards.length === 0 ? null : (
                            <>
                                <LinkPage to={`/decks/${deck?.language?.languageName}/edit-card/${deck?.deckId}/${cardIdRef.current}`}>
                                    <IconButton
                                        aria-label="Edit Card"
                                        size="md"
                                        icon={<EditIcon/>}
                                        mr={3}
                                    />
                                </LinkPage>
                                <IconButton
                                    aria-label="Delete Card"
                                    size="md"
                                    icon={<MdDelete/>}
                                    onClick={() => setIsOpen(true)}
                                    mr={3}
                                />
                            </>
                        )
                    }
                    <IconButton aria-label="Go Back" size="md" icon={<BsArrowLeft />} onClick={goBack}/>
                </Flex>
            </Flex>

            <CardsCarousel cardIdRef={cardIdRef}/>

            <AlertForDelete
                header="Delete Card"
                isOpen={isOpen}
                onClose={onClose}
                onClick={deleteHandler}
                cancelRef={cancelRef}
            />
        </Stack>
    );
}