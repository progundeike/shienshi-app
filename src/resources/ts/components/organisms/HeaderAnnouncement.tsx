import { Box, Flex, Link, Text } from "@chakra-ui/react";
import { memo } from "react";
type Props = {
    visible: boolean;
};

export const HeaderAnnouncement = memo(({ visible }: Props) => {
    if (!visible) {
        return null;
    }

    return (
        <Box
            as="section"
            aria-label="メンテナンスのご案内"
            bg="orange.50"
            color="gray.800"
            borderTop="1px solid"
            borderColor="orange.200"
            px={3}
            py={2}
        >
            <Flex
                justify="center"
                align="center"
                gap={3}
                wrap="wrap"
                fontSize="sm"
            >
                <Text fontWeight="medium">メンテナンスのお知らせ</Text>

                <Link
                    href="/"
                    isExternal
                    color="blue.700"
                    textDecoration="underline"
                    whiteSpace="nowrap"
                    aria-label="メンテナンスの詳細をトップページで確認（新しいタブで開きます）"
                >
                    詳細を見る ↗
                </Link>
            </Flex>
        </Box>
    );
});
