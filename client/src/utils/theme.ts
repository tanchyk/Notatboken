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

const Progress = {
    baseStyle: (props: GlobalStyleProps) => ({
        width: "100%",
        padding: "28px",
        paddingLeft: "35px",
        backgroundColor: mode("gray.50", "#374358")(props)
    })
}

const Card = {
    baseStyle: (props: GlobalStyleProps) => ({
        ...Stack.baseStyle(props),
        backgroundColor: mode("gray.50", "gray.700")(props),
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
        BackCard,
        Progress
    }
})

export const flags = {
    german: 'https://res.cloudinary.com/dw3hb6ec8/image/upload/v1613591994/flags/germany_uj7j4v.png',
    polish: 'https://res.cloudinary.com/dw3hb6ec8/image/upload/v1613591994/flags/poland_kuj1ll.png',
    norwegian: 'https://res.cloudinary.com/dw3hb6ec8/image/upload/v1613591994/flags/norway_mniwmm.png',
    russian: 'https://res.cloudinary.com/dw3hb6ec8/image/upload/v1613591994/flags/russia_zciob7.png',
    spanish: 'https://res.cloudinary.com/dw3hb6ec8/image/upload/v1613591994/flags/spain_ojzd3t.png',
    french: 'https://res.cloudinary.com/dw3hb6ec8/image/upload/v1613591994/flags/france_kt0j2q.png'
}