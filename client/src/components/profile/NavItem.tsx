import React from "react";
import {Text, Flex, Icon} from "@chakra-ui/react";
import {IconType} from "react-icons";

interface NavItemProps {
    id: 'basic' | 'change-p' | 'delete';
    handleClick: (event: React.MouseEvent<HTMLParagraphElement>) => void;
    clicked: 'basic' | 'change-p' | 'delete';
    icon?: IconType | null;
}

interface NavItemPropsDeck {
    id: 'decks-home' | 'progress' | 'folders';
    handleClick: (event: React.MouseEvent<HTMLParagraphElement>) => void;
    clicked: 'decks-home' | 'progress' | 'folders';
    icon?: IconType | null;
}

export const NavItem: React.FC<NavItemProps | NavItemPropsDeck> = ({id, handleClick, clicked, children, icon=null}) => {
    return (
        <Flex
            direction="row"
            paddingLeft={clicked === id ? 9 : 10}
            borderLeft={clicked === id ? "4px solid #E2E8F0" : ""}
            onClick={handleClick}
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