import React from "react";
import {Wrapper} from "../components/wrappers/Wrapper";
import {Stack, Box, Flex, Heading, Text, Link, Image, useStyleConfig} from "@chakra-ui/react";
import {
    Link as LinkPage
} from "react-router-dom";

export const ErrorPage: React.FC = () => {
    const styleStack = useStyleConfig("Stack");

    return (
        <Flex justifyContent="center">
            <Wrapper variant="regular">
                <Box
                    sx={styleStack}
                    w="100%"
                    padding={10}
                    margin={8}
                    spacing={5}
                >
                    <Stack direction="row" alignItems="center" flexWrap={["wrap", "wrap", "nowrap","nowrap"]}>
                        <Box textAlign="center" w={["100%", "100%", "100%", "50%"]}>
                            <Box w="83%" margin="auto">
                                <Heading fontSize="120px">404</Heading>
                                <Text fontSize="xl">Oooops, something went wrong, please go back to the <Link
                                    color="blue.500" as={LinkPage} to='/'>main page.</Link></Text>
                            </Box>
                        </Box>
                        <Box w={["100%", "100%", "100%", "50%"]}>
                            <Box boxSize={["240px", "240px", "300px", "360px"]} margin="auto">
                                <Image
                                    src="https://lh3.googleusercontent.com/lI7mHVeXFS-kHuz_oxSuYfzkiwSq57MVeIVWe0G0D7n-pFYV3S_faBWFk1-uVz18r4A6gTvi9oU_Wa5qCovE8oOKf2Yy7jsGiPJuzX_jS01ScANz2SnPepkSZ5T2Esrz6sU5YB9OdNwOc70QG0NfLCVEokxADVb9is_4U9GbVPCRrzm6HA39hgmzoqJKribY6pY2YD_rjRy12zDISd2fkaP0emASW0cmKi6DBShwcuqY6wQc3s02HD-FB44InHfb-VAykyvlAjTyjpdqtA1ShsFyLh8gf8qCrKEPHHpkc1VbygXUzsQwgtWHzq5sHc1Q908TDRRnG6hWIWyMtcj0Qa7aA6XjbPPgYOPwmNVQwtPQGOQSV-faDMHGRSHfjuEgzbtXM1mds4lzCv9cjcVQw8Mur1JKBD-Xq8GoP43b9ETWcUqaIF_MLizcmPRYQ6Q46lv2GbkBa3H08qnuTgknV490kWiqsYVTycHjojAgFZCclwZXpvVW6ez0RRcmxBELNd40K0Dr5C3BkM5vGQlh8knz6tRDKAaRDjI_iEqOR2wrQXl1KV53WRP4MHzRpq-BbQap6vb33xwaZjV_YEDYDaYnkVhixXWC8z8f5Zf4VS_MiKPjqSOi0Ss86Cq7wim6skatYHjjcjROLNTwThJP_2TrT6On1fS9V0KNREguKcfSABmw_PayZpuaeY0EuA=s512-no?authuser=0"/>
                            </Box>
                        </Box>
                    </Stack>
                </Box>
            </Wrapper>
        </Flex>
    );
}