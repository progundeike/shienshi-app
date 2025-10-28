import { Box, Flex, Heading } from "@chakra-ui/react";
import { FC, memo } from "react";
import { dateUtils } from "../../utils/dateUtils";

export const TopPage: FC = memo(() => {
    const { examYear, examMonth, examDate } = dateUtils();

    return (
        <Box w="80%" my="20px" mx="auto">
            <Flex gap="20px" direction="column">
                <Box>
                    <Heading size="md">
                        次の試験日は
                        {`${examYear}年 ${examMonth}月 ${examDate}日`}
                    </Heading>
                    <Box>コンテンツ</Box>
                </Box>
                <Box>
                    <Heading size="md">このサイトについて</Heading>
                    <Box>コンテンツ</Box>
                </Box>
            </Flex>
        </Box>
    );
});
