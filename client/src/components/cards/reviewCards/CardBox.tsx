import React, {useMemo, useState} from "react";
import {API_PEXELS, CardData, Proficiency} from "../../../utils/types";
import {Stack, Image, Flex, Heading, Text, Button, useStyleConfig} from "@chakra-ui/react";
import ReactCardFlip from "react-card-flip";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../../../store/store";
import {editCardStatus} from "../../../store/cardSlice";
import {userData} from "../../../store/userSlice";

interface CardBoxProps {
    card: CardData;
    setCardId: React.Dispatch<React.SetStateAction<number | null>>;
}

const proficiencyValues: Array<Proficiency> = ['fail', 'repeat', '1d', '3d', '7d', '21d', '31d', '90d', 'learned'];

export const CardBox: React.FC<CardBoxProps> = ({card, setCardId}) => {
    const styleCard = useStyleConfig("Card");
    const backCard = useStyleConfig("BackCard");

    //Card state
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector(userData);
    const [isFlipped, setIsFlipped] = useState<boolean>(false);
    const [photo, setPhoto] = useState<any>(null);
    const [profStatus, setProfStatus] = useState<Array<Proficiency>>([])

    const handleFlip = (event: React.MouseEvent) => {
        event.preventDefault();
        setIsFlipped(!isFlipped);
    }

    const sendStatus = (prof: Proficiency) => {
        setPhoto(null);
        setIsFlipped(false);
        dispatch(editCardStatus({cardId: card.cardId!, proficiency: prof, userGoal: user.userGoal!}));
    }

    const loadImage = async () => {
        if(card.imageId) {
            console.log(API_PEXELS)
            const imageFromFetch = await fetch(`https://api.pexels.com/v1/photos/${card.imageId}`, {
                    headers: {
                        Authorization: API_PEXELS
                    }
                }
            ).then(response => response.json())

            setPhoto(imageFromFetch);
        }
    }

    useMemo(async () => {
        await loadImage();
        setCardId(card.cardId);
        if(card.proficiency) {
            card.proficiency === 'fail' ? setProfStatus([
                card.proficiency,
                proficiencyValues[proficiencyValues.indexOf(card.proficiency) + 1],
                proficiencyValues[proficiencyValues.indexOf(card.proficiency) + 2],
                proficiencyValues[proficiencyValues.indexOf(card.proficiency) + 3]
            ]) : setProfStatus([
                'fail',
                card.proficiency,
                proficiencyValues[proficiencyValues.indexOf(card.proficiency) + 1],
                proficiencyValues[proficiencyValues.indexOf(card.proficiency) + 2],
            ])
        }
    }, [card])

    return (
        <>
            <Flex _hover={{cursor: "pointer"}}>
                <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
                    <Stack
                        sx={styleCard}
                        onClick={handleFlip}
                        justifyContent={ photo ? "" : "center"}
                    >
                        {
                            photo ? (
                                    <Image
                                        src={photo.src.medium}
                                        maxH="50%"
                                        w="100%"
                                        borderRadius="lg"
                                        objectFit="cover"
                                    />
                            ) : null
                        }
                        <Flex
                            sx={backCard}
                            direction="column"
                            h="100%"
                        >
                            <Heading as="h1" size="lg">{card.nativeWord}</Heading>
                            {
                                card.nativeContext ? <Text fontSize="lg" mt={2}>{card.nativeContext}</Text> : null
                            }
                        </Flex>
                    </Stack>
                    <Stack
                        sx={styleCard}
                        onClick={handleFlip}
                        justifyContent="center"
                    >
                        <Flex
                            sx={backCard}
                            direction="column"
                        >
                            <Heading as="h1" size="lg">{card.foreignWord}</Heading>
                            {
                                card.foreignContext ? <Text fontSize="lg"  mt={2}>{card.foreignContext}</Text> : null
                            }
                        </Flex>
                    </Stack>
                </ReactCardFlip>
            </Flex>
            {
                isFlipped && profStatus ? (
                    <Stack mb={0} w="250px" spacing="3px" direction="row">
                        <Button
                            colorScheme="pink"
                            size="lg"
                            w="62.5px"
                            borderRightRadius={0}
                            onClick={() => sendStatus(profStatus[0])}
                        >
                            {profStatus[0]}
                        </Button>
                        <Button
                            colorScheme="gray"
                            size="lg"
                            w="62.5px"
                            borderRadius={0}
                            onClick={() => sendStatus(profStatus[1])}
                        >
                            {profStatus[1]}
                        </Button>
                        <Button
                            colorScheme="teal"
                            size="lg"
                            w="62.5px"
                            borderRadius={0}
                            onClick={() => sendStatus(profStatus[2])}
                        >
                            {profStatus[2]}
                        </Button>
                        <Button
                            colorScheme="blue"
                            size="lg"
                            w="62.5px"
                            borderLeftRadius={0}
                            onClick={() => sendStatus(profStatus[3])}
                        >
                            {profStatus[3]}
                        </Button>
                    </Stack>
                ) : null
            }
        </>
    );
}