import {CsrfSliceType, ErrorDeleteFolder, FolderSliceType} from "../utils/types";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {Folder} from "../../../server/entities/Folder";

const initialState = {
    folders: [],
    status: 'idle',
    error: {
        type: null,
        message: null
    }
} as FolderSliceType;

//Async reducers
export const fetchFolder = createAsyncThunk<Array<Folder>, {languageId: number}>(
    'folders/fetchFolders',
    async (folderData) => {
        const response = await fetch(`/api/folders/find-folders/${folderData.languageId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return (await response.json()) as Array<Folder>;
    }
);

export const addFolder = createAsyncThunk<Folder, {folderName: string, languageId: number}>(
    'folders/addFolder',
    async (folderData, {getState}) => {
        const {csrfToken} = getState() as {csrfToken: CsrfSliceType};
        const response = await fetch('/api/folders/create-folder', {
            method: 'POST',
            body: JSON.stringify(folderData),
            headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': `${csrfToken.csrfToken}`
            }
        });
        return (await response.json()) as Folder;
    }
);

export const editFolder = createAsyncThunk<Folder, {folderId: number, folderName: string}>(
    'folders/editFolder',
    async (folderData, {getState}) => {
        const {csrfToken} = getState() as { csrfToken: CsrfSliceType };
        const response = await fetch('/api/folders/edit-folder', {
            method: 'PUT',
            body: JSON.stringify(folderData),
            headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': `${csrfToken.csrfToken}`
            }
        });
        return (await response.json()) as Folder;
    }
)

export const addDeckToFolder = createAsyncThunk<{folder: Folder}, {folderId: number, deckId: number}>(
    'folders/addDeckToFolder',
    async (folderData, {getState}) => {
        const {csrfToken} = getState() as { csrfToken: CsrfSliceType };
        const response = await fetch('/api/folders/add-deck-folder', {
            method: 'PUT',
            body: JSON.stringify(folderData),
            headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': `${csrfToken.csrfToken}`
            }
        });
        return (await response.json()) as {folder: Folder};
    }
);

export const deleteDeckFromFolder = createAsyncThunk<{folder: Folder}, {folderId: number, deckId: number}>(
    'folders/deleteDeckFromFolder',
    async (folderData, {getState}) => {
        const {csrfToken} = getState() as { csrfToken: CsrfSliceType };
        const response = await fetch('/api/folders/delete-deck-folder', {
            method: 'PUT',
            body: JSON.stringify(folderData),
            headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': `${csrfToken.csrfToken}`
            }
        })
        return (await response.json()) as {folder: Folder};
    }
);

export const deleteFolder = createAsyncThunk<ErrorDeleteFolder, {folderId: number}>(
    'folders/deleteFolder',
    async (folderData, {getState}) => {
        const {csrfToken} = getState() as {csrfToken: CsrfSliceType};
        const response = await fetch('/api/folders/delete-folder', {
            method: 'DELETE',
            body: JSON.stringify(folderData),
            headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': `${csrfToken.csrfToken}`
            }
        }).then(response => {
            if(response.status === 204) {
                return {
                    message: 'Deleted',
                    folderId: folderData.folderId
                };
            } else {
                return response.json()
            }
        });
        return (response) as ErrorDeleteFolder;
    }
);

//Extra Reducers
const fetchFolderPending = (state: FolderSliceType, {}) => {
    return Object.assign({}, state, {status: 'loading'});
}

const fetchFolderRejected = (state: FolderSliceType, {}) => {
    return Object.assign({}, state, {status: 'failed'});
}

const decksOperations = (state: FolderSliceType, { payload }: { payload: {folder: Folder} }) => {
    if ("message" in payload) {
        return Object.assign({}, state, {
            status: 'failed',
            error: {
                type: 'failedAddDeckToFolder',
                message: payload['message']
            }
        });
    } else {
        return Object.assign({}, state, {
            folders: state.folders.map(folder => {
                if(folder.folderId === payload.folder.folderId) {
                    return payload.folder;
                } else {
                    return folder;
                }
            }),
            status: 'succeeded'
        })
    }
}

const folderSlice = createSlice({
    name: 'folders',
    initialState,
    reducers: {
        clearFolderError: (state: FolderSliceType) => {
            if(state.folders.length > 0) {
                state.status = 'succeeded';
            } else {
                state.status = 'idle';
            }
            state.error.message = null;
            state.error.type = null;
        },
        clearFolders: (state: FolderSliceType) => {
            return Object.assign({}, state, initialState);
        }
    },
    extraReducers: builder => {
        //Fetch
        builder.addCase(fetchFolder.pending, fetchFolderPending)
        builder.addCase(fetchFolder.fulfilled, (state: FolderSliceType, { payload }: { payload: Array<Folder> }) => {
            if ("message" in payload) {
                return Object.assign({}, state, {
                    status: 'failed',
                    error: {
                        type: 'loadFolders',
                        message: payload['message']
                    }
                });
            } else {
                return Object.assign({}, state, {
                    folders: state.folders.concat(payload.sort(
                        (folderA, folderB) => new Date(folderA.createdAt).getTime() - new Date(folderB.createdAt).getTime()
                    )),
                    status: 'succeeded'
                });
            }
        })
        builder.addCase(fetchFolder.rejected, fetchFolderRejected)

        //Create
        builder.addCase(addFolder.pending, fetchFolderPending)
        builder.addCase(addFolder.fulfilled, (state: FolderSliceType, { payload }) => {
            if ("message" in payload) {
                return Object.assign({}, state, {
                    status: 'failed',
                    error: {
                        message: payload['message'],
                        type: 'failedCreateFolder'
                    }
                });
            } else {
                return Object.assign({}, state, {
                    folders: state.folders.concat(payload),
                    status: 'succeeded',
                    error: {
                        type: 'createFolder',
                        message: null
                    }
                });
            }
        })
        builder.addCase(addFolder.rejected, fetchFolderRejected)

        //Edit folder
        builder.addCase(editFolder.pending, fetchFolderPending)
        builder.addCase(editFolder.fulfilled, (state: FolderSliceType, { payload }: { payload: Folder }) => {
            if ("message" in payload) {
                return Object.assign({}, state, {
                    status: 'failed',
                    error: {
                        type: 'editFolder',
                        message: payload['message']
                    }
                });
            } else {
                return Object.assign({}, state, {
                    folders: state.folders.map(folder => {
                        if(folder.folderId === payload.folderId) {
                            return payload;
                        } else {
                            return folder;
                        }
                    }),
                    status: 'succeeded',
                    error: {
                        type: null,
                        message: null
                    }
                })
            }
        })
        builder.addCase(editFolder.rejected, fetchFolderRejected)

        //Add deck
        builder.addCase(addDeckToFolder.pending, fetchFolderPending)
        builder.addCase(addDeckToFolder.fulfilled, decksOperations)
        builder.addCase(addDeckToFolder.rejected, fetchFolderRejected)

        //Delete Deck From Folder
        builder.addCase(deleteDeckFromFolder.pending, fetchFolderPending)
        builder.addCase(deleteDeckFromFolder.fulfilled, decksOperations)
        builder.addCase(deleteDeckFromFolder.rejected, fetchFolderRejected)

        //Delete
        builder.addCase(deleteFolder.pending, fetchFolderPending)
        builder.addCase(deleteFolder.fulfilled, (state: FolderSliceType, { payload} : {payload: ErrorDeleteFolder}) => {
            if(payload.message === 'Deleted') {
                return Object.assign({}, state,{
                    folders: state.folders.filter(folder => folder.folderId !== payload!.folderId),
                    status: 'succeeded'
                }, {error: {type: 'deleteFolder'}});
            } else {
                return;
            }
        })
        builder.addCase(deleteFolder.rejected, fetchFolderRejected)
    }
})

export const foldersData = (state: {folders: FolderSliceType}) => state.folders.folders;
export const singleFolder = (state: {folders: FolderSliceType}, folderId: number) => state.folders.folders.find(folder => folder.folderId === folderId);
export const foldersStatus = (state: {folders: FolderSliceType}) => state.folders.status;
export const foldersError = (state: {folders: FolderSliceType}) => state.folders.error;

export const {clearFolderError, clearFolders} = folderSlice.actions;

export default folderSlice.reducer;