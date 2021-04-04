import React from "react";
import {withApollo} from "../utils/withApollo";
import {useMeQuery} from "../generated/graphql";
import {NoAuth} from "../components/noauth/NoAuth";
import {Navbar} from "../components/Navbar";
import {Flex, useColorModeValue} from "@chakra-ui/react";
import {Wrapper} from "../components/wrappers/Wrapper";

const Index: React.FC = () => {
    const {data} = useMeQuery();
    const bgValue = useColorModeValue("#fff", "gray.700");

    return (
        <>
            <Navbar />
            <Flex bg={data?.me ? "initial" : bgValue} justifyContent="center">
                <Wrapper variant='regular'>
                    {
                        data?.me ? (
                            <h1>hi</h1>
                        ) : (
                            <NoAuth />
                        )
                    }
                </Wrapper>
            </Flex>
        </>
    )
}

export default withApollo({ssr: true})(Index);
