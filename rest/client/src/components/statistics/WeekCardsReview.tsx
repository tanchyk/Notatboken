import React, {useEffect, useState} from "react";
import {Box, Heading, Stack, useStyleConfig} from "@chakra-ui/react";
import {Bar} from "react-chartjs-2";
import {getRequest} from "../../store/requestFunction";

const countArrayOfDays = () => {
    const ary = [];
    let weekday = new Date();
    for(let i = 0; i < 7; i++) {
        ary.unshift(weekday.toLocaleString("default", { weekday: "short" }))
        weekday.setDate(weekday.getDate() - 1);
    }

    return ary;
}

const options = {
    scales: {
        yAxes: [
            {
                ticks: {
                    beginAtZero: true,
                },
            },
        ],
    },
}


export const WeekCardsReview: React.FC = () => {
    const styleStack = useStyleConfig("Stack");

    const [weekData, setWeekData] = useState<Array<number> | null>(null)

    const loadData = async () => {
        setWeekData(await getRequest("/statistics/get-card-week-review").then(response => response.json()))
    }

    useEffect(() => {
        loadData()
    }, [])

    const data = {
        labels: countArrayOfDays(),
        datasets: [
            {
                label: '# of Card Reviews',
                data: weekData,
                backgroundColor: 'rgba(49, 130, 206, 0.4)',
                borderColor: 'rgba(43, 108, 176, 1)',
                borderWidth: 1,
            },
        ],
    }

    return (
        <Box>
            <Heading as="h1" fontSize="22px">Week Activity</Heading>
            <Stack
                sx={styleStack}
                padding={4}
                marginTop={5}
            >
                <Bar data={data} options={options}/>
            </Stack>
        </Box>
    );
}