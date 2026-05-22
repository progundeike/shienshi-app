import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Flex,
    Text,
    useBreakpointValue,
} from "@chakra-ui/react";
import { FC, memo } from "react";
import { useNewsItem } from "../../hooks/useNewsItem";
export const DisplayNewsItemList: FC = memo(() => {
    const { newsItemList } = useNewsItem();
    const newsItems = newsItemList.data ?? [];
    const accordionDefaultIndex = useBreakpointValue({
        base: undefined,
        md: 0,
    });

    return (
        <Box backgroundColor="white">
            <Box
                maxH="300px"
                overflowY="auto"
                mt={2}
                border="1px solid"
                borderColor="#CCCCCC"
                sx={{ scrollbarGutter: "stable" }}
            >
                {newsItems.map((item: any) => (
                    <Box key={item.id} borderBottom="1px Solid #CCCCCC" p={1}>
                        <Flex direction="row" gap={5} alignItems="center">
                            <Text
                                whiteSpace="nowrap"
                                fontSize={{ base: "sm", md: "md" }}
                            >
                                {new Date(item.published_at).toLocaleDateString(
                                    "ja-JP",
                                    {
                                        year: "numeric",
                                        month: "numeric",
                                        day: "numeric",
                                        timeZone: "Asia/Tokyo",
                                    },
                                )}
                            </Text>
                            <Box>
                                {item.content ? (
                                    <Accordion
                                        allowToggle
                                        defaultIndex={accordionDefaultIndex}
                                    >
                                        <AccordionItem
                                            border="none"
                                            padding="0"
                                        >
                                            <AccordionButton p={2}>
                                                <Box>
                                                    <Text
                                                        fontSize={{
                                                            base: "sm",
                                                            md: "md",
                                                        }}
                                                    >
                                                        {item.title}
                                                    </Text>
                                                </Box>
                                                <AccordionIcon />
                                            </AccordionButton>
                                            <AccordionPanel
                                                textAlign="left"
                                                pb={4}
                                            >
                                                <Text
                                                    fontSize={{
                                                        base: "sm",
                                                        md: "md",
                                                    }}
                                                >
                                                    {item.content}
                                                </Text>
                                            </AccordionPanel>
                                        </AccordionItem>
                                    </Accordion>
                                ) : (
                                    <Box p={2}>
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
