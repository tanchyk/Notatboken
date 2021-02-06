import React, {useEffect, useState} from "react";
import {
    match
} from 'react-router-dom';
import {Wrapper} from "../components/wrappers/Wrapper";
import {
    Flex,
    Heading,
    Text
} from "@chakra-ui/react";
import {history} from '../App';
import {useSelector} from "react-redux";
import {userData} from "../store/userSlice";
import {DecksHome} from "../components/decks/DecksHome";
import {Languages} from "../utils/types";

interface DecksProps {
    match: match<{language: string}>
}

const DecksPage: React.FC<DecksProps> = ({match}) => {
    const language = match.params.language.charAt(0).toUpperCase() + match.params.language.slice(1);
    const [languageId, setLanguageId] = useState<number | null>(null);
    const user = useSelector(userData);

    useEffect(() => {
        console.log('Check for languages is called')
        let check = false;
        user.languages?.forEach(languageUser => {
            if(languageUser.languageName === language) {
                check = true;
                setLanguageId(languageUser.languageId);
            }
        });
        if(!check) {
            history.push('/error')
        }
    }, [])

    return (
        <>
            <Flex
                justifyContent="center"
                backgroundColor="cyan.600"
                paddingTop={10}
                paddingBottom={10}
            >
                <Wrapper variant="regular">
                    <Heading color="white" fontSize="38px">{language}</Heading>
                    <Text color="white">here you will se stats</Text>
                </Wrapper>
            </Flex>
            <Flex justifyContent="center">
                <Wrapper variant="regular">
                    {
                        languageId ? (<DecksHome language={language as Languages} languageId={languageId}/>) : null
                    }

                </Wrapper>
            </Flex>
        </>
    );
}

export default DecksPage;