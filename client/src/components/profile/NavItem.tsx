import React from "react";
import {Text} from "@chakra-ui/react";

interface NavItemProps {
    id: 'basic' | 'change-p' | 'delete'
    handleClick: (event: React.MouseEvent<HTMLParagraphElement>) => void
    clicked: 'basic' | 'change-p' | 'delete'
}

export const NavItem: React.FC<NavItemProps> = ({id, handleClick, clicked, children}) => {
    return (
        <Text
            fontSize="lg"
            id={id}
            onClick={handleClick}
            fontWeight={clicked === id ? 'bold' : 'regular'}
            paddingLeft={clicked === id ? 9 : 10}
            borderLeft={clicked === id ? "4px solid #E2E8F0" : ""}
        >
            {children}
        </Text>
    );
}