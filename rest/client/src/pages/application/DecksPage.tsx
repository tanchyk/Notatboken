import React, {useContext, useEffect, useState} from "react";
import {Redirect, Route, Switch, useRouteMatch} from 'react-router-dom';
import {Wrapper} from "../../components/wrappers/Wrapper";
import {
    Box,
    Flex,
    Heading,
    Image,
    Stack,
    useStyleConfig
} from "@chakra-ui/react";
import {history, LanguageContext} from '../../App';
import {useDispatch, useSelector} from "react-redux";
import {userData} from "../../store/userSlice";
import {Decks} from "../../components/decks/Decks";
import {Languages} from "../../utils/types";
import {CreateCard} from "../../components/cards/createUpdateCards/CreateCard";
import {decksStatus, fetchDecks, clearDecks} from "../../store/deckSlice";
import {AppDispatch} from "../../store/store";
import {EditDeck} from "../../components/decks/EditDeck";
import {CardsReview} from "../../components/cards/reviewCards/CardsReview";
import {EditCard} from "../../components/cards/EditCard";
import {Folders} from "../../components/folders/Folders";
import {ChooseFolder} from "../../components/decks/ChooseFolder";
import {EditFolder} from "../../components/folders/EditFolder";
import {flags} from "../../utils/theme";
import {DecksReview} from "../../components/folders/DecksReview";
import {Progress} from "../../components/progress/Progress";
import {clearFolders, fetchFolder, foldersStatus} from "../../store/folderSlice";
import {NameWrapper} from "../../components/wrappers/NameWarpper";
import {NavDecks} from "../../components/decks/NavDecks";

const DecksPage: React.FC = () => {
    const styleStack = useStyleConfig("Stack");
    const match = useRouteMatch<{language: string}>();

    const [_, setLanguage] = useContext(LanguageContext);
    setLanguage(match.params.language);
    const language = match.params.language.charAt(0).toUpperCase() + match.params.language.slice(1);
    const [languageId, setLanguageId] = useState<number | null>(null);

    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector(userData);
    const deckStatus = useSelector(decksStatus);
    const folderStatus = useSelector(foldersStatus);

    useEffect(() => {
        dispatch(clearDecks());
        dispatch(clearFolders());
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
        if(folderStatus === 'idle' && languageId !== null) {
            dispatch(fetchFolder({languageId}))
        }
    }, [folderStatus, languageId])

    useEffect(() => {
        if (deckStatus === 'idle' && languageId !== null) {
            dispatch(fetchDecks({languageId}));
        }
    }, [deckStatus, languageId]);

    return (
        <>
            <NameWrapper>
                <Flex direction="row">
                    <Heading color="white" fontSize={language === 'Norwegian' ? ["28px", "32px", "38px", "38px"] : "38px"} mr={3}>{language}</Heading>
                    <Image src={flags[language.toLowerCase() as keyof typeof flags]} w="40px" pt={[0,0,2,2]}/>
                </Flex>
            </NameWrapper>
            <Flex justifyContent="center">
                <Wrapper variant="regular">
                    {
                        languageId ? (
                            <>
                                <Stack
                                    sx={styleStack}
                                    w={["100%", "100%", "35%", "35%", "35%", "27%"]}
                                    display={["none", "none", "flex", "flex", "flex", "flex"]}
                                    h="65vh"
                                    paddingTop={8}
                                    paddingBottom={8}
                                    marginTop={8}
                                >
                                    <NavDecks url={match.url} />
                                </Stack>
                                <Box w={["100%", "100%", "60%", "60%", "60%", "70%"]}>
                                    <Switch>
                                        <Route
                                            path={`${match.url}/home`}
                                            render={() => <Decks language={language as Languages} languageId={languageId}/>}
                                        />
                                        <Route
                                            path={`${match.url}/folders`}
                                            render={() => <Folders language={language as Languages} languageId={languageId} />}
                                        />
                                        <Route path={`${match.url}/progress`} component={Progress} />
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