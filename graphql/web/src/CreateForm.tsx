import React, {useEffect, useRef} from "react";
import {Button, Heading, useStyleConfig} from "@chakra-ui/react";
import {Field, FieldProps, Form, Formik, FormikProps} from "formik";
import * as Yup from "yup";
import {useRouter} from "next/router";
import {UserInput} from "./components/inputs/UserInput";

const NameSchema = Yup.object().shape({
    name: Yup.string()
        .min(3, 'Too Short, name should be longer than 3.')
        .max(40, 'Too Long, name should be shorter than 40.')
        .required('Required')
});

interface CreateFormProps {
    closeCreateComponent: () => void;
    type: 'folder' | 'deck';
}

export const CreateForm: React.FC<CreateFormProps> = ({closeCreateComponent, type}) => {
    const styleStack = useStyleConfig("Stack");
    styleStack.borderLeftWidth = "6px";

    const router = useRouter();
    const {language, languageId} = router.query;

    const formikRef = useRef<FormikProps<{ name: string }> | null>(null);

    const dispatch = useDispatch<AppDispatch>();
    const error = type === 'folder' ? useSelector(foldersError) : useSelector(decksError);

    useEffect(() => {
        if (error.type === 'failedCreateFolder') {
            formikRef.current!.setFieldError('name', error.message as string);
        } else if (error.type === 'createFolder') {
            dispatch(clearFolderError());
            formikRef.current!.resetForm();
        } else if (error.type === 'createDeck') {
            dispatch(clearDeckError());
            formikRef.current!.resetForm();
        } else if (error.type === 'notCreateDeck') {
            formikRef.current!.setFieldError('name', error.message as string);
        }
    }, [error])

    return (
        <Formik
            innerRef={formikRef}
            initialValues={{
                name: ''
            }}
            validationSchema={NameSchema}
            onSubmit={async (values) => {
                if (type === 'folder') {
                    await dispatch(addFolder({folderName: values.name, languageId}));
                } else {
                    await dispatch(addDeck({deckName: values.name, languageId}));
                }
            }}
        >
            {() => (
                <Form>
                    <CreateWrapper
                        src={type === 'folder' ? (
                            "https://res.cloudinary.com/dw3hb6ec8/image/upload/v1614520638/app/create-folder_nor9m1.png"
                        ) : (
                            "https://res.cloudinary.com/dw3hb6ec8/image/upload/v1614518831/app/create-deck_qtofyd.png"
                        )}
                        closeCreateComponent={closeCreateComponent}
                    >
                        <Heading size="lg">{`Create a new ${type} for the ${language} language.`}</Heading>
                        <Field name="name">
                            {({field, form}: FieldProps) => (
                                <UserInput
                                    size="lg"
                                    name="name"
                                    placeholder={`Enter the ${type} name here`}
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
                            {
                                type === 'folder' ? 'Create Folder' : 'Create Deck'
                            }
                        </Button>
                    </CreateWrapper>
                </Form>
            )}
        </Formik>
    );
}