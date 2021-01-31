import React from "react";
import {Flex, Heading, Text} from "@chakra-ui/react";
import {Wrapper} from "../components/wrappers/Wrapper";
import {useSelector} from "react-redux";
import {userData} from "../store/userSlice";

const audio = "https:\/\/apifree.forvo.com\/audio\/3a1i1n3p3h3k3n1n1g3a1l37331p1g3l3m3g3h2e1h3a1o232i2e362q1m3k1p252b1k2i2g341j363q1m2c3f372e2n3n2n1b1i2j293e3e361m3n2k1b211f2a2b2b_3n3l2a232g3i3g2h2d3e3p3n343g361h372n38352e211t1t"

const StartPage: React.FC = () => {
    const user = useSelector(userData);

    return (
        <Flex direction="column">
            <Flex
                justifyContent="center"
                backgroundColor="cyan.700"
                paddingTop={10}
                paddingBottom={10}
            >
                <Wrapper variant="regular">
                    <Heading color="white" size="2xl">{user.name ? user.name : user.username}</Heading>
                    <Text color="white">here you will se stats</Text>
                </Wrapper>
            </Flex>
            <audio controls>
                <source src={audio} type="audio/ogg; codecs=vorbis"/>
                    <source src={audio} type="audio/mpeg"/>
                        Тег audio не поддерживается вашим браузером.
                        <a href={audio}>Скачайте музыку</a>.
            </audio>
        </Flex>
    );
}

export default StartPage;