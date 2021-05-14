import React from "react";
import {useRouter} from "next/router";
import {Navbar} from "../components/Navbar";
import {NameWrapper} from "../components/wrappers/NameWrapper";
import {Flex, Heading, Image} from "@chakra-ui/react";
import {flags} from "../utils/theme";
import {Wrapper} from "../components/wrappers/Wrapper";
import {useMeQuery} from "../generated/graphql";
import Custom404 from "../pages/404";

export const LanguageLayout: React.FC = () => {
    const router = useRouter();
    const {language} = router.query;

    const {data} = useMeQuery();

    return data?.me!.userLanguages.some(languageUser => languageUser.languageName.toLowerCase() === language) ?
        <Custom404/> : (
            <>
                <Navbar/>
                <NameWrapper>
                    <Flex direction="row">
                        <Heading color="white"
                                 fontSize={language === 'Norwegian' ? ["28px", "32px", "38px", "38px"] : "38px"}
                                 mr={3}>{(language as string).charAt(0).toUpperCase() + language!.slice(1)}</Heading>
                        <Image
                            src={flags[(language as string).toLowerCase() as keyof typeof flags]}
                            w="40px"
                            pt={[0, 0, 2, 2]}
                        />
                    </Flex>
                </NameWrapper>
                <Flex justifyContent="center">
                    <Wrapper variant="regular">

                    </Wrapper>
                </Flex>
            </>
        );
}