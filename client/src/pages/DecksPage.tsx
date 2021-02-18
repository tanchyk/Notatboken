import React, {useContext, useEffect, useMemo, useState} from "react";
import {
    Link as LinkPage,
    Redirect, Route, Switch, useRouteMatch
} from 'react-router-dom';
import {Wrapper} from "../components/wrappers/Wrapper";
import {
    Box,
    Flex,
    Heading,
    Image,
    Stack,
    Text,
    Divider,
    useStyleConfig, Icon
} from "@chakra-ui/react";
import {history, LanguageContext} from '../App';
import {useDispatch, useSelector} from "react-redux";
import {userData} from "../store/userSlice";
import {NavItemProfile} from "../components/profile/NavItemProfile";
import {DecksHome} from "../components/decks/DecksHome";
import {Languages} from "../utils/types";
import {IoLanguageOutline, FaRegFolderOpen, GiProgression, RiHome4Line} from "react-icons/all";
import {CreateCard} from "../components/cards/createUpdateCards/CreateCard";
import {decksStatus, fetchDecks, clearDecks} from "../store/deckSlice";
import {AppDispatch} from "../store/store";
import {EditDeck} from "../components/decks/EditDeck";
import {CardsReview} from "../components/cards/reviewCards/CardsReview";
import {EditCard} from "../components/cards/EditCard";
import {Folders} from "../components/folders/Folders";
import {ChooseFolder} from "../components/decks/ChooseFolder";
import {EditFolder} from "../components/folders/EditFolder";
import {flags} from "../utils/theme";
import {DecksReview} from "../components/folders/DecksReview";

const DecksPage: React.FC = () => {
    const styleStack = useStyleConfig("Stack");
    const match = useRouteMatch<{language: string}>();
    const [clicked, setClicked] = useState<'decks-home' | 'progress' | 'folders'>('decks-home');

    const [_, setLanguage] = useContext(LanguageContext);
    setLanguage(match.params.language);
    const language = match.params.language.charAt(0).toUpperCase() + match.params.language.slice(1);
    const [languageId, setLanguageId] = useState<number | null>(null);

    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector(userData);
    const deckStatus = useSelector(decksStatus);

    useMemo(() => {
        if(window.location.pathname.includes('folders')) {
            setClicked('folders')
        } else if(window.location.pathname.includes('progress')) {
            setClicked('progress')
        } else {
            setClicked('decks-home')
        }
    }, [window.location.pathname])

    useEffect(() => {
        dispatch(clearDecks());
        let check = false;
        user.languages?.forEach(languageUser => {
            if (languageUser.languageName === language) {
                check = true;
                console.log('Loaded language', _)
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
    }, [deckStatus, languageId]);

    return (
        <>
            <Flex
                justifyContent="center"
                backgroundColor="cyan.600"
                paddingTop={9}
                paddingBottom={9}
            >
                <Wrapper variant="regular">
                    <Flex direction="row">
                        <Heading color="white" fontSize="38px" mr={3}>{language}</Heading>
                        <Image src={flags[language.toLowerCase() as keyof typeof flags]} w="40px" pt={2}/>
                    </Flex>
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
                                        <NavItemProfile
                                            id="decks-home"
                                            clicked={clicked}
                                            icon={RiHome4Line}
                                        >
                                            Home
                                        </NavItemProfile>
                                    </LinkPage>
                                    <LinkPage to={`${match.url}/progress`}>
                                        <NavItemProfile
                                            id="progress"
                                            clicked={clicked}
                                            icon={GiProgression}
                                        >
                                            Progress
                                        </NavItemProfile>
                                    </LinkPage>
                                    <LinkPage to={`${match.url}/folders`}>
                                        <NavItemProfile
                                            id="folders"
                                            clicked={clicked}
                                            icon={FaRegFolderOpen}
                                        >
                                            Folders
                                        </NavItemProfile>
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
                                        <Route
                                            path={`${match.url}/home`}
                                            render={() => <DecksHome language={language as Languages} languageId={languageId}/>}
                                        />
                                        <Route
                                            path={`${match.url}/folders`}
                                            render={() => <Folders language={language as Languages} languageId={languageId} />}
                                        />
                                        <Route path={`${match.url}/:languageId/edit-folder/:folderId`} component={EditFolder}/>
                                        <Route path={`${match.url}/add-to-folder/:deckId`} component={ChooseFolder} />
                                        <Route path={`${match.url}/add-card/:deckId`} component={CreateCard}/>
                                        <Route path={`${match.url}/edit-deck/:deckId`} component={EditDeck}/>
                                        <Route path={`${match.url}/edit-card/:deckId/:cardId`} component={EditCard} />
                                        <Route path={`${match.url}/review/:deckId`} component={CardsReview}/>
                                        <Route path={`${match.url}/:languageId/folders/review/:folderId`} component={DecksReview}/>
                                        <Redirect to={`${match.url}/home`}/>
                                    </Switch>
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