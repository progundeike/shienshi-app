import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { FC, memo } from "react";
import { Link } from "react-router-dom";

export const Header: FC = memo(() => {
    return (
        <Box backgroundColor="white">
            <Box w="90%" m="auto" p="20px">
                <Flex
                    justifyContent="space-between"
                    wrap="wrap"
                    alignItems="center"
                >
                    {/* 左バナー */}
                    <Link to="/">
                        <Heading
                            as="h1"
                            size="md"
                            fontSize="30px"
                            fontWeight="400"
                            textShadow="1px 1px 1px gray"
                        >
                            情報処理安全確保支援士 午後対策
                        </Heading>
                    </Link>

                    {/* 右メニュー */}
                    {/* {isMobileView ? <MobileMenu /> : <PcMenu />} */}
                    <Flex gap="20px">
                        <Box>about</Box>
                        <Box>試験一覧</Box>
                        <Box>ユーザー登録</Box>
                    </Flex>
                </Flex>
            </Box>
        </Box>
    );
});
