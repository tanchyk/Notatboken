import React, {useCallback, useState} from "react";
import {
    useDisclosure,
    Box,
    Flex,
    Text,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton, ModalBody, Modal, Image
} from "@chakra-ui/react";
import {HiPhotograph} from "react-icons/all";
import {AdditionalDataBox} from "../boxes/AdditionalDataBox";
import {API_PEXELS} from "../../../../utils/types";

interface ChoosePhotoProps {
    nativeWord: string;
    isDisabled: boolean;
    setPhoto:  React.Dispatch<React.SetStateAction<any>>;
}

export const ChoosePhoto: React.FC<ChoosePhotoProps> = ({nativeWord, isDisabled, setPhoto}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [images, setImages] = useState<any>();
    const [imageError, setImageError] = useState<string | null>(null);

    //Load and prepare images
    const loadImages = useCallback(async () => {
        setImageError(null);
        console.log(API_PEXELS);
        const imagesFromFetch = await fetch(`https://api.pexels.com/v1/search?query=${nativeWord}`, {
                headers: {
                    Authorization: API_PEXELS
                }
            }
        ).then(response => response.json())

        if(imagesFromFetch.photos.length !== 15) {
            setImageError("We can't find a photo for you 😢");
        } else {
            //Setting images for better user interaction
            setImages([
                imagesFromFetch.photos.slice(0, 5),
                imagesFromFetch.photos.slice(5, 10),
                imagesFromFetch.photos.slice(10, 15)
            ]);
        }
    }, [nativeWord]);

    //Functions for user clicks
    const openModal = async () => {
        onOpen();
        await loadImages();
    }

    const choosePhoto = (photo: any) => {
        setPhoto(photo);
        onClose();
    }

    return (
        <>
            <AdditionalDataBox icon={HiPhotograph} text="Add a photo to a card?" onOpen={openModal} isDisabled={isDisabled}/>

            <Modal isOpen={isOpen} onClose={onClose} size="5xl">
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>
                        Search for Photos
                    </ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        {
                            imageError ? (<Text fontSize="xl">{imageError}</Text>) : (
                                <Flex direction="row" flexWrap="wrap">
                                    {
                                        images?.map((ary: any, index: number) => {
                                            return (
                                                <Flex key={index} direction="column" w="33%">
                                                    {
                                                        ary.map((photo: any, index: number) => {
                                                            return (
                                                                <Box
                                                                    key={index}
                                                                    m={3}
                                                                    maxH="320px"
                                                                    overflow="hidden"
                                                                    _hover={{cursor: "pointer"}}
                                                                    _active={{
                                                                        transform: "scale(0.98)",
                                                                        transitionDuration: "100ms",
                                                                        borderColor: "#bec3c9",
                                                                    }}
                                                                    onClick={() => choosePhoto(photo)}
                                                                >
                                                                    <Image src={photo.src.medium} h="auto" w="100%" />
                                                                </Box>
                                                            );
                                                        })
                                                    }
                                                </Flex>
                                            );
                                        })
                                    }
                                </Flex>
                            )
                        }
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}