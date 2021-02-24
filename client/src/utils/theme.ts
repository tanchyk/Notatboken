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

export const langColors = {
    German: {
        backgroundColor: 'rgba(45, 55, 72, 0.4)',
        borderColor: 'rgba(45, 55, 72, 1)'
    },
    Polish: {
        backgroundColor: 'rgba(155, 44, 44, 0.4)',
        borderColor: 'rgba(155, 44, 44, 1)'
    },
    Norwegian: {
        backgroundColor: 'rgba(44, 82, 130, 0.4)',
        borderColor: 'rgba(44, 82, 130, 1)'
    },
    Russian: {
        backgroundColor: 'rgba(226, 232, 240, 0.4)',
        borderColor: 'rgba(226, 232, 240, 1)'
    },
    Spanish: {
        backgroundColor: 'rgba(192, 86, 33, 0.4)',
        borderColor: 'rgba(192, 86, 33, 1)'
    },
    French: {
        backgroundColor: 'rgba(159, 122, 234, 0.4)',
        borderColor: 'rgba(159, 122, 234, 1)'
    }
}