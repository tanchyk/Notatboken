import React from "react";
import {DecksHomeProps} from "../decks/DecksHome";
import {useSelector} from "react-redux";
import {decksData} from "../../store/deckSlice";
import {NoProgress} from "./NoProgress";
import {
    Heading,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Divider,
    Box,
    useStyleConfig,
    Stack,
    SimpleGrid
} from "@chakra-ui/react";
import {ProgressDataBox} from "./boxes/ProgressDataBox";
import {foldersData} from "../../store/folderSlice";
import {ProgressFolderBox} from "./boxes/ProgressFolderBox";
import {NoDataBox} from "../NoDataBox";

export const Progress: React.FC<DecksHomeProps> = () => {
    const styleStack = useStyleConfig("Stack");
    const styleProgress = useStyleConfig("Progress");
    styleStack.borderLeftWidth = "6px";

    const decks = useSelector(decksData);
    const folders = useSelector(foldersData);

    return (
        decks.length === 0 ? <NoProgress /> : (
            <Box
                sx={styleStack}
                marginTop={8}
                marginBottom={8}
                paddingTop={8}
            >
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
            </Box>
        )
    );
}