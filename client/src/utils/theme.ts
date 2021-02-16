import {extendTheme} from "@chakra-ui/react";
import {GlobalStyleProps, mode} from "@chakra-ui/theme-tools"

const Stack = {
    baseStyle: (props: GlobalStyleProps) => ({
        borderWidth: "1px",
        borderRadius: "lg",
        overflow: "hidden",
        backgroundColor: mode("#fff", "gray.700")(props)
    })
}

const Card = {
    baseStyle: (props: GlobalStyleProps) => ({
        ...Stack.baseStyle(props),
        borderWidth: "2px",
        w: "250px",
        h: "360px",
        alignItems: "center"
    })
}

const BackCard = {
    baseStyle: {
        w: "70%",
        justifyContent: "center",
        alignItems: "center",
    }
}

export const theme = extendTheme({
    styles: {
        global: (props) => ({
            "html, body": {
                fontSize: "sm",
                backgroundColor: mode("#f7f7f7", "gray.800")(props),
                color: mode("gray.600", "white")(props),
                lineHeight: "tall",
            },
            button: {
                fontSize: "16px",
                color: mode("gray.600", "white")(props),
                backgroundColor: "transparent",
                _hover: {bg: "gray.100"},
                _active: {
                    transform: "scale(0.98)",
                    borderColor: "#bec3c9",
                },
                type: "submit"
            }
        }),
    },
    components: {
        Stack,
        Card,
        BackCard
    }
})

export const flags = {
    german: 'https://cdn.countryflags.com/thumbs/germany/flag-waving-250.png',
    polish: 'https://cdn.countryflags.com/thumbs/poland/flag-waving-250.png',
    norwegian: 'https://cdn.countryflags.com/thumbs/norway/flag-waving-250.png',
    russian: 'https://cdn.countryflags.com/thumbs/russia/flag-waving-250.png',
    spanish: 'https://cdn.countryflags.com/thumbs/spain/flag-waving-250.png',
    french: 'https://cdn.countryflags.com/thumbs/france/flag-waving-250.png'
}