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

export const flags = {
    german: 'https://cdn.countryflags.com/thumbs/germany/flag-waving-250.png',
    english: 'https://cdn.countryflags.com/thumbs/united-kingdom/flag-waving-250.png',
    norwegian: 'https://cdn.countryflags.com/thumbs/norway/flag-waving-250.png',
    russian: 'https://cdn.countryflags.com/thumbs/russia/flag-waving-250.png',
    spanish: 'https://cdn.countryflags.com/thumbs/spain/flag-waving-250.png',
    french: 'https://cdn.countryflags.com/thumbs/france/flag-waving-250.png'
}