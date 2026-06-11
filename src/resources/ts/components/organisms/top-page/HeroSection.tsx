import { Flex, Button, Text, Image, Box } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export const HeroSection = () => {
    return (
        <Box
            position="relative"
            overflow="hidden"
            bg="linear-gradient(105deg, #ffffff 0%, #ffffff 42%, #eef6ff 100%)"
            py={{ base: 4, md: 10 }}
        >
            {/* 背景の薄い斜めグラデーション */}
            <Box
                position="absolute"
                inset={0}
                bg="linear-gradient(135deg, transparent 0%, transparent 42%, rgba(66,153,225,0.10) 42%, rgba(66,153,225,0.03) 100%)"
                zIndex={0}
            />

            <Box
                maxW="1100px"
                w="100%"
                mx="auto"
                px={{ base: 4, md: 6 }}
                position="relative"
                minH={{ base: "auto", md: "300px" }}
            >
                {/* 右側イメージ スマホ非表示*/}
                <Image
                    src="/images/hero_image.png"
                    alt="メインビジュアル"
                    display={{ base: "none", lg: "block" }}
                    position="absolute"
                    top="10px"
                    right="10px"
                    bottom="0"
                    maxW="45%"
                    h="100%"
                    objectFit="contain"
                    objectPosition="right center"
                    zIndex={0}
                    pointerEvents="none"
                />

                <Flex
                    direction={{ base: "column", lg: "row" }}
                    gap="20px"
                    alignItems="center"
                    position="relative"
                    zIndex={1}
                >
                    {/* 左コンテンツ */}
                    <Flex
                        flex="1"
                        direction="column"
                        textAlign={{ base: "center", lg: "left" }}
                        maxW={{ base: "100%", md: "560px" }}
                    >
                        <Flex
                            flex="1"
                            direction="column"
                            textAlign={{ base: "center", md: "left" }}
                        >
                            <Text
                                fontSize={{ base: "sm", md: "xl" }}
                                fontWeight="bold"
                                color="baseColor"
                                mb={2}
                            >
                                情報処理安全確保支援士 科目B対策
                            </Text>
                            <Text
                                fontSize={{ base: "2xl", md: "6xl" }}
                                fontWeight="bold"
                                lineHeight="1.2"
                                maxW="560px"
                                mb={2}
                            >
                                解く→添削→質問
                            </Text>
                            <Text
                                fontSize={{ base: "md", md: "lg" }}
                                fontWeight="bold"
                                lineHeight="1.9"
                                maxW="560px"
                            >
                                「支援士対策室」は、情報処理安全確保支援士試験の科目B対策に特化した学習支援サービスです。
                                <br />
                                過去問演習、AI添削、AIへの質問をひとつの流れで行えます。
                            </Text>
                            {/* CTAボタン */}
                            <Flex
                                mt={6}
                                mb={{ base: 8, md: 12 }}
                                gap={{ base: 4, md: 12 }}
                                flexWrap="wrap"
                                direction={{ base: "column", md: "row" }}
                                alignItems="center"
                            >
                                <Button
                                    as={Link}
                                    to="/register"
                                    w={{ base: "80%", md: "40%" }}
                                    bg="baseColor"
                                    color="white"
                                    borderRadius="full"
                                    _hover={{ bg: "blue.600", boxShadow: "lg" }}
                                >
                                    無料で始める
                                </Button>
                                <Button
                                    as={Link}
                                    to="/exams"
                                    w={{ base: "80%", md: "40%" }}
                                    bg="white"
                                    variant="outline"
                                    borderRadius="full"
                                    border="1px solid"
                                    borderColor="baseColor"
                                    color="baseColor"
                                    _hover={{
                                        bg: "gray.200",
                                        boxShadow: "lg",
                                    }}
                                >
                                    問題を見る
                                </Button>
                            </Flex>
                        </Flex>
                    </Flex>

                    {/* PCでは余白確保用、スマホでは通常画像 */}
                    <Image
                        src="/images/hero_image.png"
                        maxW="100%"
                        alt="メインビジュアル"
                        display={{ base: "block", lg: "none" }}
                    />
                </Flex>
            </Box>
        </Box>
    );
};
