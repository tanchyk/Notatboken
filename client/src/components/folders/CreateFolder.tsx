import React, {useEffect, useRef} from "react";
import {Button, Heading, useStyleConfig} from "@chakra-ui/react";
import {Formik, Form, Field, FormikProps} from "formik";
import {DecksHomeProps} from "../decks/DecksHome";
import {FieldProps} from "../../utils/types";
import {UserInput} from "../inputs/UserInput";
import * as Yup from "yup";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../../store/store";
import {addFolder, foldersError, clearFolderError} from "../../store/folderSlice";
import {CreateWrapper} from "../wrappers/CreateWrapper";

export const FolderNameSchema = Yup.object().shape({
    folderName: Yup.string()
        .min(3, 'Too Short, name should be longer than 3.')
        .max(40, 'Too Long, name should be shorter than 40.')
        .required('Required')
});

interface CreateFolderProps extends DecksHomeProps {
    closeCreateComponent: () => void;
}

export const CreateFolder: React.FC<CreateFolderProps> = ({language, languageId, closeCreateComponent}) => {
    const styleStack = useStyleConfig("Stack");
    styleStack.borderLeftWidth = "6px";

    const formikRef = useRef<FormikProps<{folderName: string}> | null>(null);

    const dispatch = useDispatch<AppDispatch>();
    const folderError = useSelector(foldersError);

    useEffect(() => {
        if (folderError.type === 'failedCreateFolder') {
            formikRef.current!.setFieldError('folderName', folderError.message as string);
        } else if (folderError.type === 'createFolder') {
            dispatch(clearFolderError());
            formikRef.current!.resetForm();
        }
    }, [folderError])

    return (
        <Formik
            innerRef={formikRef}
            initialValues={{
                folderName: ''
            }}
            validationSchema={FolderNameSchema}
            onSubmit={(values) => {
                dispatch(addFolder({folderName: values.folderName, languageId}))
            }}
        >
            {() => (
                <Form>
                    <CreateWrapper
                        src="https://res.cloudinary.com/dw3hb6ec8/image/upload/v1613509613/notatboken/folder_pfdrsa.png"
                        closeCreateComponent={closeCreateComponent}
                    >
                        <Heading size="lg">{`Create a new folder for the ${language} language.`}</Heading>
                        <Field name="folderName" >
                            {({field, form}: FieldProps) => (
                                <UserInput
                                    size="lg"
                                    name="folderName"
                                    placeholder="Enter the folder name here"
                                    field={field}
                                    form={form}
                                />
                            )}
                        </Field>
                        <Button
                            width="140px"
                            size="lg"
                            type="submit"
                        >
                            Create Folder
                        </Button>
                    </CreateWrapper>
                </Form>
            )}
        </Formik>
    );
}