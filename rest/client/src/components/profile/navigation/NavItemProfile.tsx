import React from "react";
import {Text, Flex, Icon} from "@chakra-ui/react";
import {IconType} from "react-icons";

interface NavItemProps {
    id: 'basic' | 'change-p' | 'delete' | 'goal';
    clicked: 'basic' | 'change-p' | 'delete' | 'goal';
    icon?: IconType | null;
}

interface NavItemPropsDeck {
    id: 'decks-home' | 'progress' | 'folders';
    clicked: 'decks-home' | 'progress' | 'folders';
    icon?: IconType | null;
}

export const NavItemProfile: React.FC<NavItemProps | NavItemPropsDeck> = ({id, clicked, children, icon=null}) => {
    return (
        <Flex
            direction="row"
            paddingLeft={clicked === id ? [5,5,9,9] : [6,6,10,10]}
            borderLeft={clicked === id ? "4px solid #E2E8F0" : ""}
            id={id}
            alignItems="center"
        >
            {
                icon ? <Icon as={icon} boxSize={5}/> : null
            }
            <Text
                fontSize="lg"
                ml={icon ? 2 : 0}
                fontWeight={clicked === id ? 'bold' : 'regular'}
            >
                {children}
            </Text>
        </Flex>
    );
}