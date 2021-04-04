import React, {createContext, useState} from "react";
import {ChakraProvider, } from '@chakra-ui/react';
import {theme} from '../utils/theme';
// import {theme} from '../../../../rest/client/src/utils/theme';

export const CloseContextHome = createContext<any>([]);
export const CloseContextFolders = createContext<any>([]);
export const LanguageContext = createContext<any>([]);

const MyApp = ({Component, pageProps}: any) => {
    const [closeCreateHome, setCloseCreateHome] = useState<boolean>(false);
    const [closeCreateFolders, setCloseCreateFolders] = useState<boolean>(false);
    const [language, setLanguage] = useState<string | null>(null);

    return (
        <ChakraProvider theme={theme}>
            <CloseContextHome.Provider value={[closeCreateHome, setCloseCreateHome]}>
                <CloseContextFolders.Provider value={[closeCreateFolders, setCloseCreateFolders]}>
                    <LanguageContext.Provider value={[language, setLanguage]}>
                        <Component {...pageProps} />
                    </LanguageContext.Provider>
                </CloseContextFolders.Provider>
            </CloseContextHome.Provider>
        </ChakraProvider>
    )
}

export default MyApp
