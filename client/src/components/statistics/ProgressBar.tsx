import React, {useEffect, useState} from "react";
import {Stack, Progress, useStyleConfig, Text} from "@chakra-ui/react";

interface Amount {
    amountOfCards: number;
    amountOfCardsLearned: number;
}

export const ProgressBar: React.FC = () => {
    const styleStack = useStyleConfig("Stack");
    const bgText = useStyleConfig("BgText");

    const [amount, setAmount] = useState<Amount | null>(null)

    const loadData = async () => {
        setAmount(await fetch(
            "/api/statistics/get-user-progress", {
                method: 'GET'
            }
        ).then(response => response.json()))
    }

    useEffect(() => {
        loadData()
    }, [])

    return (
        <Stack
            sx={styleStack}
            padding={4}
            spacing={1}
        >
            <Text fontSize="lg" fontWeight="600" alignSelf="flex-end">{`${Math.round(amount && amount.amountOfCards !== 0 ? amount.amountOfCardsLearned / amount.amountOfCards * 100 : 0)}%`}</Text>
            <Progress
                borderRadius="md"
                hasStripe
                value={amount && amount.amountOfCards !== 0 ? amount.amountOfCardsLearned / amount.amountOfCards * 100 : 0}
            />
            <Text sx={bgText}>cards studied</Text>
        </Stack>
    );
}