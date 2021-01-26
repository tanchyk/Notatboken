import {extendTheme} from "@chakra-ui/react";

const Stack = {
    baseStyle: {
        borderWidth: "1px",
        borderRadius: "lg",
        overflow: "hidden",
        backgroundColor: "#fff"
    }
}

export const theme = extendTheme({
    styles: {
        global: {
            "html, body": {
                fontSize: "sm",
                backgroundColor: "#f7f7f7",
                color: "gray.600",
                lineHeight: "tall",
            },
            button: {
                fontSize: "16px",
                color: "gray.600",
                backgroundColor: "transparent",
                _hover: {bg: "gray.100"},
                _active: {
                    transform: "scale(0.98)",
                    borderColor: "#bec3c9",
                },
                type: "submit"
            }
        },
    },
    components: {
        Stack
    }
})