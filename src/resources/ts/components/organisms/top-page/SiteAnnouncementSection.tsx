import { Box, Flex, Heading, Link, Text } from "@chakra-ui/react";
import { memo } from "react";

import { useSiteAnnouncement } from "../../../hooks/useSiteAnnouncement";
import { SiX } from "react-icons/si";

export const SiteAnnouncementSection = memo(() => {
    const { data } = useSiteAnnouncement();

    // 未取得・非公開の場合は何も表示しない
    if (!data?.top_visible || !data.message) {
        return null;
    }

    return (
        <Box
            as="section"
            aria-labelledby="site-announcement-title"
            maxW="1200px"
            mx="auto"
            px={{ base: 4, md: 6 }}
            py={{ base: 3, md: 4 }}
        >
            <Box
                bg="orange.50"
                color="gray.800"
                border="1px solid"
                borderColor="orange.200"
                borderRadius="md"
                p={{ base: 3, md: 4 }}
            >
                <Heading id="site-announcement-title" as="h2" size="md" mb={3}>
                    サーバーメンテナンスのお知らせ
                </Heading>

                <Text
                    whiteSpace="pre-wrap"
                    overflowWrap="anywhere"
                    lineHeight="1.4"
                    fontSize={{ base: "sm", md: "sm" }}
                >
                    {data.message}
                </Text>

                <Flex
                    direction={{ base: "column", md: "row" }}
                    alignItems={{ base: "flex-start", md: "center" }}
                    mt={3}
                    fontSize="sm"
                >
                    <Box>作業状況は公式Xでお知らせしています。</Box>
                    <Link
                        href="https://x.com/shienshi_com"
                        isExternal
                        display="inline-flex"
                        alignItems="center"
                        alignSelf={{ base: "center", md: "auto" }}
                        gap={2}
                        color="gray.700"
                        textDecoration="none"
                        _hover={{
                            color: "black",
                            textDecoration: "none",
                        }}
                        _focusVisible={{
                            outline: "2px solid",
                            outlineColor: "blue.500",
                            outlineOffset: "3px",
                        }}
                        aria-label="支援士対策室の公式X（新しいタブで開きます）"
                    >
                        <SiX size={14} aria-hidden="true" />
                        @shienshi_com
                    </Link>
                </Flex>
            </Box>
        </Box>
    );
});
