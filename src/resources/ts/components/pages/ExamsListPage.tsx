import { FC, memo } from "react";
import { Box, Image, Text, Heading, Flex } from "@chakra-ui/react";
import { DesktopExamTable } from "../organisms/DesktopExamTable";
import { MobileExamsList } from "../organisms/MobileExamsList";

export const ExamsListPage: FC = memo(() => {
    return (
        <Box>
            {/* ヘッダー */}
            <Box
                position="relative"
                overflow="hidden"
                bg="#eef6ff"
                p={{ base: 1, md: 2 }}
            >
                <Flex
                    justifyContent={{ base: "center", md: "space-between" }}
                    maxW="1000px"
                    mx="auto"
                >
                    <Flex
                        direction="column"
                        m={{ base: 0, md: 4 }}
                        maxW="520px"
                        gap={{ base: 0, md: 4 }}
                    >
                        <Heading>過去問一覧</Heading>
                        <Text display={{ base: "none", md: "flex" }}>
                            解いた後はAI添削と質問機能で理解を深められます。
                        </Text>
                    </Flex>

                    <Flex
                        w="240px"
                        flexShrink={0}
                        display={{ base: "none", md: "flex" }}
                    >
                        <Image
                            src="/images/exams_list_header_image.png"
                            objectFit="contain"
                        />
                    </Flex>
                </Flex>
            </Box>

            {/* 過去問のリスト */}
            <Box bg="white" py={{ base: 4, md: 10 }}>
                <Box maxW="1200px" mx="auto">
                    <Box
                        w={{ base: "100%", md: "80%" }}
                        m="auto"
                        textAlign="center"
                    >
                        <Box display={{ base: "none", md: "block" }}>
                            <DesktopExamTable />
                        </Box>

                        <Box display={{ base: "block", md: "none" }}>
                            <MobileExamsList />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
});
