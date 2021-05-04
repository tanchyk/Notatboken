import React from "react";
import {withApollo} from "../utils/withApollo";
import {useMeQuery} from "../generated/graphql";
import {NoAuth} from "../components/noauth/NoAuth";
import {Navbar} from "../components/Navbar";
import {Flex, useColorModeValue} from "@chakra-ui/react";
import {Wrapper} from "../components/wrappers/Wrapper";
import {Home} from "../components/home/Home";

const Index: React.FC = () => {
    const {data} = useMeQuery();
    const bgValue = useColorModeValue("#fff", "gray.700");

    return (
        <>
            <Navbar/>
            {
                data?.me ? (
                    <Home user={data.me}/>
                ) : (
                    <Flex bg={data?.me ? "initial" : bgValue} justifyContent="center">
                        <Wrapper variant='regular'>
                            <NoAuth/>
                        </Wrapper>
                    </Flex>
                )
            }
        </>
    )
}

export default withApollo({ssr: true})(Index);
