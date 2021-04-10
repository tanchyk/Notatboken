import React, {useCallback} from 'react';
import {Flex, Text, Image, Stack, useStyleConfig} from "@chakra-ui/react";
import {useDropzone} from "react-dropzone";
import {useFormikContext} from "formik";

interface AvatarZoneProps {
    avatar: string;
    username: string;
}

export const AvatarZone: React.FC<AvatarZoneProps> = ({avatar, username}) => {
    const dropzone = useStyleConfig("Dropzone");
    const bgText = useStyleConfig("BgText");

    const {setFieldValue, setFieldError} = useFormikContext();

    const onDrop = useCallback(acceptedFiles => {
        acceptedFiles.forEach(async (acceptedFile: any) => {
            const reader = new FileReader();
            reader.readAsDataURL(acceptedFile);
            reader.onloadend = () => {
                setFieldValue('avatarData', reader.result);
            }
        })
    }, [])

    const onDropRejected = useCallback(() => {
        return setFieldError('avatarData', "File size is too large! Choose a photo that is less than 5mb.");
    }, [])

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        onDropRejected,
        accept: 'image/*',
        multiple: false,
        maxSize: 5000000
    })

    return (
        <Stack direction={["column", "row", "column", "column", "row", "row"]} spacing={5}>
            <Image
                borderRadius="full"
                boxSize="150px"
                src={avatar}
                alt={username}
            />
            <Stack spacing={4}>
                <Flex
                    sx={dropzone}
                    {...getRootProps()}
                >
                    <input {...getInputProps()} />
                    {
                        isDragActive ? (
                            <Text
                                sx={bgText}
                                w="60%"
                            >
                                Drop the files here ...
                            </Text>
                        ) : (
                            <Text
                                sx={bgText}
                                w="60%"
                            >
                                Drag and drop your image here, or click to select files
                            </Text>
                        )
                    }
                </Flex>
            </Stack>
        </Stack>
    );
}