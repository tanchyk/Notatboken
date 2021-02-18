import React, {useEffect} from "react";
import {AdditionalDecksWrapper} from "../wrappers/AdditionalDecksWrapper";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../../store/store";
import {FolderSliceType} from "../../utils/types";
import {fetchFolder, foldersStatus, singleFolder} from "../../store/folderSlice";
import {history} from "../../App";
import {EditFolderProps} from "./EditFolder";
import {DeckBox} from "../decks/boxes/DeckBox";
import {SimpleGrid} from "@chakra-ui/react";
import {NoDataBox} from "../NoDataBox";

export const DecksReview: React.FC<EditFolderProps> = ({match}) => {
    const folderId = Number.parseInt(match.params.folderId);
    const languageId = Number.parseInt(match.params.languageId);

    const dispatch = useDispatch<AppDispatch>();
    const folder = useSelector((state: {folders: FolderSliceType}) => singleFolder(state, folderId));
    const folderStatus = useSelector(foldersStatus);

    useEffect(() => {
        if(folderStatus === 'idle') {
            dispatch(fetchFolder({languageId}))
        }
        if(folder === undefined && folderStatus === 'succeeded') {
            history.push('/error');
        }
    }, [folderStatus])

    return (
        <AdditionalDecksWrapper title={`Decks in ${folder?.folderName} folder 🗂`} w="100%">
            {
                folder && folder.decks?.length !== 0 ? (
                    <SimpleGrid columns={2} spacing={4} marginTop={2} marginBottom={2}>
                        {
                            folder.decks?.map((deck, index) => <DeckBox deck={deck} key={index}/>)
                        }
                    </SimpleGrid>
                ) : <NoDataBox type="decks" />
            }
        </AdditionalDecksWrapper>
    );
}