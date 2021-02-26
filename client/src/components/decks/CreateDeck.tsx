import React, {useState} from "react";
import {Button, Heading} from "@chakra-ui/react";
import * as Yup from "yup";
import {DecksHomeProps} from "./DecksHome";
import {CreateWrapper} from "../wrappers/CreateWrapper";
import {CreateAlert} from "./CreateAlert";

export const DeckNameSchema = Yup.object().shape({
    deckName: Yup.string()
        .min(3, 'Too Short, name should be longer than 3.')
        .max(40, 'Too Long, name should be shorter than 40.')
        .required('Required')
});

interface DecksCreateProps extends DecksHomeProps {
    closeCreateComponent: () => void
}

export const CreateDeck: React.FC<DecksCreateProps> = ({language, languageId, closeCreateComponent}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <CreateWrapper
                src="https://res.cloudinary.com/dw3hb6ec8/image/upload/v1612990212/notatboken/pen-full_pwu6cj.png"
                closeCreateComponent={closeCreateComponent}
            >
                <Heading size="lg">{`Create a study deck for the ${language} language.`}</Heading>
                <Button
                    width="140px"
                    size="lg"
                    type="submit"
                    onClick={() => setIsOpen(true)}
                    marginTop={5}
                >
                    Create Deck
                </Button>
            </CreateWrapper>

            <CreateAlert languageId={languageId} isOpen={isOpen} setIsOpen={setIsOpen}/>
        </>
    );
}