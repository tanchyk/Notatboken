import React, {useEffect, useState} from "react";
import {
    Link as LinkPage,
    match, Redirect, Route, Switch
} from 'react-router-dom';
import {Wrapper} from "../components/wrappers/Wrapper";
import {
    Box,
    Flex,
    Heading,
    Stack,
    Text,
    Divider,
    useStyleConfig, Icon
} from "@chakra-ui/react";
import {history} from '../App';
import {useDispatch, useSelector} from "react-redux";
import {userData} from "../store/userSlice";
import {NavItem} from "../components/profile/NavItem";
import {DecksHome} from "../components/decks/DecksHome";
import {Languages} from "../utils/types";
import {IoLanguageOutline, FaRegFolderOpen, GiProgression, RiHome4Line} from "react-icons/all";
import {AddCard} from "../components/cards/AddCard";
import {decksData, decksStatus, fetchDecks, clearDecks} from "../store/deckSlice";
import {AppDispatch} from "../store/store";
import {EditDeck} from "../components/decks/EditDeck";

interface DecksProps {
    match: match<{language: string}>
}

const DecksPage: React.FC<DecksProps> = ({match}) => {
    const styleStack = useStyleConfig("Stack");
    const [clicked, setClicked] = useState<'decks-home' | 'progress' | 'folders'>('decks-home');
    const handleClick = (event: React.MouseEvent<HTMLParagraphElement>) => setClicked(event.currentTarget.id as 'decks-home' | 'progress' | 'folders');

    const language = match.params.language.charAt(0).toUpperCase() + match.params.language.slice(1);
    const [languageId, setLanguageId] = useState<number | null>(null);
    const user = useSelector(userData);

    const dispatch = useDispatch<AppDispatch>();

    const decks = useSelector(decksData);
    const deckStatus = useSelector(decksStatus);

    useEffect(() => {
        dispatch(clearDecks());
        let check = false;
        user.languages?.forEach(languageUser => {
            if (languageUser.languageName === language) {
                check = true;
                setLanguageId(languageUser.languageId);
            }
        });
        if (!check) {
            history.push('/error');
        }
    }, [])

    useEffect(() => {
        if (deckStatus === 'idle' && languageId !== null) {
            dispatch(fetchDecks({languageId: languageId}));
        }
    }, [decks, languageId]);

    return (
        <>
            <Flex
                justifyContent="center"
                backgroundColor="cyan.600"
                paddingTop={9}
                paddingBottom={9}
            >
                <Wrapper variant="regular">
                    <Heading color="white" fontSize="38px">{language}</Heading>
                    <Text color="white">here you will se stats</Text>
                </Wrapper>
            </Flex>
            <Flex justifyContent="center">
                <Wrapper variant="regular">
                    {
                        languageId ? (
                            <>
                                <Stack
                                    sx={styleStack}
                                    w={["100%", "90%", "40%", "27%"]}
                                    h="438.2px"
                                    paddingTop={8}
                                    paddingBottom={8}
                                    marginTop={8}
                                    spacing={5}
                                >
                                    <LinkPage to={`${match.url}/home`}>
                                        <NavItem
                                            id="decks-home"
                                            handleClick={handleClick}
                                            clicked={clicked}
                                            icon={RiHome4Line}
                                        >
                                            Home
                                        </NavItem>
                                    </LinkPage>
                                    <LinkPage to={`${match.url}/progress`}>
                                        <NavItem
                                            id="progress"
                                            handleClick={handleClick}
                                            clicked={clicked}
                                            icon={GiProgression}
                                        >
                                            Progress
                                        </NavItem>
                                    </LinkPage>
                                    <LinkPage to={`${match.url}/folders`}>
                                        <NavItem
                                            id="folders"
                                            handleClick={handleClick}
                                            clicked={clicked}
                                            icon={FaRegFolderOpen}
                                        >
                                            Folders
                                        </NavItem>
                                    </LinkPage>
                                    <Divider/>
                                    <LinkPage to="/">
                                        <Flex
                                            alignItems="center"
                                            direction="row"
                                            paddingLeft={10}
                                        >
                                            <Icon as={IoLanguageOutline} boxSize={5}/>
                                            <Text
                                                fontSize="lg"
                                                fontWeight="600"
                                                ml={2}
                                            >
                                                Languages
                                            </Text>
                                        </Flex>
                                    </LinkPage>
                                </Stack>
                                <Box w={["100%", "90%", "55%", "70%"]}>
                                    <Switch>
                                        <Route path={`${match.url}/home`} render={() => <DecksHome language={language as Languages} languageId={languageId}/>}/>
                                        {/*<Route path={`${match.url}/progress`} component={ChangePassword}/>*/}
                                        <Route path={`${match.url}/add-card/:deckId`} component={AddCard}/>
                                        <Route path={`${match.url}/edit-deck/:deckId`} component={EditDeck}/>
                                        <Redirect to={`${match.url}/home`}/>
                                    </Switch>
                                    {/*<DecksHome language={language as Languages} languageId={languageId}/>*/}
                                </Box>
                            </>
                            ) : null
                    }

                </Wrapper>
            </Flex>
        </>
    );
}

export default DecksPage;