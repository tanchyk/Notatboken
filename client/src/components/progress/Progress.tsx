import React from "react";
import {DecksHomeProps} from "../decks/Decks";
import {useSelector} from "react-redux";
import {decksData, decksStatus} from "../../store/deckSlice";
import {NoProgress} from "./NoProgress";
import {
    Heading,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Divider,
    useStyleConfig,
    Stack,
    SimpleGrid, Skeleton
} from "@chakra-ui/react";
import {ProgressDataBox} from "./boxes/ProgressDataBox";
import {foldersData} from "../../store/folderSlice";
import {ProgressFolderBox} from "./boxes/ProgressFolderBox";
import {NoDataBox} from "../NoDataBox";
import {AppWrapper} from "../wrappers/AppWrapper";

export const Progress: React.FC<DecksHomeProps> = () => {
    const styleProgress = useStyleConfig("Progress");

    const decks = useSelector(decksData);
    const deckStatus = useSelector(decksStatus);
    const folders = useSelector(foldersData);

    return (
        deckStatus === 'loading' && decks.length === 0 ? (
            <Stack mt={8} mb={8}>
                <Skeleton height="40px" />
                <Skeleton height="40px" />
                <Skeleton height="40px" />
                <Skeleton height="40px" />
                <Skeleton height="40px" />
                <Skeleton height="40px" />
            </Stack>
        ) : (
            <>
                {
                    decks.length === 0 ? <NoProgress /> : (
                        <AppWrapper>
                            <Heading size="lg" ml={10} mb={6}>Progress</Heading>
                            <Tabs variant="soft-rounded">
                                <TabList mb="1em" ml={10}>
                                    <Tab>Decks</Tab>
                                    <Tab ml={2}>Folders</Tab>
                                </TabList>
                                <Divider />
                                <TabPanels>
                                    <TabPanel sx={styleProgress}>
                                        <Stack spacing={4}>
                                            {
                                                decks.map((deck, index) => <ProgressDataBox deck={deck} key={index} />)
                                            }
                                        </Stack>
                                    </TabPanel>
                                    <TabPanel sx={styleProgress}>
                                        {
                                            folders.length === 0 ? <NoDataBox type="folders" /> : (
                                                <SimpleGrid columns={2} spacing={4}>
                                                    {
                                                        folders.map((folder, index) => <ProgressFolderBox folder={folder} key={index} />)
                                                    }
                                                </SimpleGrid>
                                            )
                                        }
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>
                        </AppWrapper>
                    )
                }
            </>
        )
    );
}