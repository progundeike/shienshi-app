import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Button,
    Flex,
    Heading,
    Text,
} from "@chakra-ui/react";
import { FC, memo } from "react";
import { useNewsItem } from "../../hooks/useNewsItem";
export const DisplayNewsItemList: FC = memo(() => {
    const { newsItemList } = useNewsItem();
    const newsItems = newsItemList.data ?? [];

    return (
        <Box backgroundColor="white">
            <Box
                maxH="300px"
                overflowY="auto"
                mt="10px"
                border="1px solid"
                borderColor="#CCCCCC"
                sx={{ scrollbarGutter: "stable" }}
            >
                {newsItems.map((item: any) => (
                    <Box key={item.id} borderBottom="1px Solid #CCCCCC" p="5px">
                        <Flex direction="row" gap="20px" alignItems="center">
                            <Box w="50px">
                                {new Date(item.published_at).toLocaleDateString(
                                    "ja-JP",
                                    {
                                        month: "numeric",
                                        day: "numeric",
                                        timeZone: "Asia/Tokyo",
                                    },
                                )}
                            </Box>
                            <Box>
                                {item.content ? (
                                    <Accordion allowToggle defaultIndex={[0]}>
                                        <AccordionItem
                                            border="none"
                                            padding="0"
                                        >
                                            <AccordionButton p="10px">
                                                <Box>
                                                    <Text>{item.title}</Text>
                                                </Box>
                                                <AccordionIcon />
                                            </AccordionButton>
                                            <AccordionPanel
                                                textAlign="left"
                                                pb={4}
                                            >
                                                {item.content}
                                            </AccordionPanel>
                                        </AccordionItem>
                                    </Accordion>
                                ) : (
                                    <Box p="10px">
                                        <Text size="sm">{item.title}</Text>
                                    </Box>
                                )}
                            </Box>
                        </Flex>
                    </Box>
                ))}
            </Box>
        </Box>
    );
});
