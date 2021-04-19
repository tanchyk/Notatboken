import React, {useEffect} from "react";
import {useRouteMatch} from 'react-router-dom';
import {Field, Form, Formik} from "formik";
import {AdditionalDecksWrapper} from "../wrappers/AdditionalDecksWrapper";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../../store/store";
import {FieldProps, FolderSliceType} from "../../utils/types";
import {editFolder, fetchFolder, foldersError, foldersStatus, singleFolder, clearFolderError} from "../../store/folderSlice";
import {Alert, AlertDescription, AlertIcon, Box, Button, Heading, SimpleGrid, Stack} from "@chakra-ui/react";
import {UserInput} from "../inputs/UserInput";
import {history} from "../../App";
import {NoDataBox} from "../NoDataBox";
import {SmallDeckBox} from "./boxes/SmallDeckBox";
import {DeckNameSchema} from "../../utils/validationFunctions";

export const EditFolder: React.FC = () => {
    const match = useRouteMatch<{folderId: string, languageId: string}>();
    const folderId = Number.parseInt(match.params.folderId);
    const languageId = Number.parseInt(match.params.languageId);

    //Load decks
    const dispatch = useDispatch<AppDispatch>();
    const folder = useSelector((state: {folders: FolderSliceType}) => singleFolder(state, folderId));
    const folderStatus = useSelector(foldersStatus);
    const folderError = useSelector(foldersError);

    useEffect(() => {
        dispatch(clearFolderError())
    }, [])

    useEffect(() => {
        if(folderStatus === 'idle') {
            dispatch(fetchFolder({languageId}))
        }
        if(folder === undefined && folderStatus === 'succeeded') {
            history.push('/error');
        }
    }, [folderStatus])

    return (
        <Formik
            initialValues={{
                folderName: ''
            }}
            onSubmit={async (values) => {
                dispatch(editFolder({folderId, folderName: values.folderName, languageId}));
            }}
        >
            {() => (
                <AdditionalDecksWrapper title={`Edit folder ${folder?.folderName}`} type="folder">
                    <Form>
                        <Stack spacing={5} mt={3}>
                            <Heading size="md">{`Change the name of your folder ${folder?.folderName}`}</Heading>
                            {
                                folderError.type === 'editFolder' ? (
                                    <Alert status="error">
                                        <AlertIcon/>
                                        <AlertDescription fontSize="lg">{folderError.message}</AlertDescription>
                                    </Alert>
                                ) : null
                            }
                            <Box>
                                <Field name="folderName" validate={DeckNameSchema}>
                                    {({field, form}: FieldProps) => (
                                        <UserInput
                                            size="md"
                                            name="folderName"
                                            placeholder="Put your new folder name here"
                                            field={field}
                                            form={form}
                                        />
                                    )}
                                </Field>
                            </Box>

                            <Button type="submit" width="80px">
                                Change
                            </Button>
                        </Stack>
                    </Form>

                    <Stack
                        paddingTop={4}
                        spacing={3}
                    >
                        <Heading size="md">Decks in your folder:</Heading>
                        {
                            folder?.decks && folder?.decks.length !== 0 ? (
                                <SimpleGrid columns={1} spacing={4}>
                                    {
                                        folder.decks.map((deck, index) => <SmallDeckBox deck={deck} folderId={folderId} key={index}/>)
                                    }
                                </SimpleGrid>
                            ) : <NoDataBox type="decks"/>
                        }
                    </Stack>
                </AdditionalDecksWrapper>
            )}
        </Formik>
    );
}