import {
    Box,
    Flex,
    Heading,
    Text,
    Image,
    HStack,
    Button,
} from "@chakra-ui/react";
import React, { FC, memo } from "react";

import { dateUtils } from "../../utils/dateUtils";
import { DisplayNewsItemList } from "../organisms/DisplayNewsItemList";
import { LuBell } from "react-icons/lu";
import { Link } from "react-router-dom";
import { Card } from "../atoms/Card";

const LearningStepCard: FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <Box
            backgroundColor="white"
            borderRadius={5}
            border="1px solid"
            borderColor="#CCCCCC"
            textAlign="center"
            shadow="md"
            p={7}
            w={{ base: "100%", md: "30%" }}
        >
            {children}
        </Box>
    );
};

export const TopPage: FC = memo(() => {
    return (
        <Box maxW="1200px" w="100%" mx="auto" px={{ base: 4, md: 6 }} mb="50px">
            <Flex gap={5} direction="column">
                <Box my={10} textColor="baseColor">
                    {/* ヒーローセクション */}
                    <Flex
                        direction={{ base: "column", md: "row" }}
                        gap="20px"
                        alignItems="center"
                    >
                        {/* 左コンテンツ */}
                        <Flex flex="1" direction="column">
                            <Text
                                fontSize={{ base: "4xl", md: "6xl" }}
                                fontWeight="bold"
                                lineHeight="1.2"
                                maxW="560px"
                                textAlign="center"
                                mb={2}
                            >
                                解く→添削→訊く。
                            </Text>
                            <Text
                                fontSize={{ base: "md", md: "lg" }}
                                lineHeight="1.9"
                                maxW="560px"
                            >
                                「支援士対策室」は、情報処理安全確保支援士試験の科目B対策に特化した学習支援サービスです。
                                <br />
                                過去問演習、AI添削、AIへの質問をひとつの流れで行えます。
                            </Text>
                        </Flex>
                        {/* 右コンテンツ */}
                        <Image
                            src="/images/main_visual_1.png"
                            // maxW="520px"
                            maxW={{ base: "100%", md: "520px" }}
                            alt="メインビジュアル"
                            display="block"
                        />
                    </Flex>

                    {/* CTAボタン */}
                    <Flex
                        my="50px"
                        gap={{ base: 4, md: 12 }}
                        flexWrap="wrap"
                        direction={{ base: "column", md: "row" }}
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Button
                            as={Link}
                            to="/register"
                            w={{ base: "80%", md: "300px" }}
                            bg="baseColor"
                            colorScheme="blue"
                            borderRadius="full"
                            _hover={{ bg: "blue.600", boxShadow: "lg" }}
                        >
                            無料で始める
                        </Button>
                        <Button
                            as={Link}
                            to="/exams"
                            w={{ base: "80%", md: "300px" }}
                            bg="white"
                            variant="outline"
                            borderRadius="full"
                            outline="0.5px solid"
                            _hover={{
                                bg: "gray.200",
                                boxShadow: "lg",
                            }}
                        >
                            問題を見る
                        </Button>
                    </Flex>

                    {/* サービスの特徴 */}
                    <Box mx="auto" my={7} textAlign="center">
                        <Heading
                            size={{ base: "md", md: "xl" }}
                            color="baseColor"
                            mb={5}
                        >
                            情報処理安全確保支援士試験突破のための3つのステップ
                        </Heading>
                        <Flex
                            direction={{ base: "column", md: "row" }}
                            justifyContent="space-between"
                            gap={5}
                        >
                            <LearningStepCard>
                                <Box textAlign="center" mx="auto">
                                    <Text fontSize="2xl">過去問を解く</Text>

                                    <Image
                                        src="/images/image_card_1.png"
                                        h="160px"
                                        objectFit="cover"
                                        alt="過去問を解く"
                                        mx="auto"
                                        display="block"
                                    />
                                    <Text>
                                        試験対策には過去問を解いて、実際の試験形式に慣れることが重要です。
                                    </Text>
                                </Box>
                            </LearningStepCard>
                            <LearningStepCard>
                                <Text fontSize="2xl">AIで添削</Text>
                                <Image
                                    src="/images/image_card_2.png"
                                    h="160px"
                                    objectFit="cover"
                                    alt="AIに質問"
                                    mx="auto"
                                    display="block"
                                />
                                <Text>
                                    記述式の問題が多い科目B試験をAIのフィードバックでサポートします。
                                </Text>
                            </LearningStepCard>
                            <LearningStepCard>
                                <Text fontSize="2xl">AIに質問</Text>
                                <Image
                                    src="/images/image_card_3.png"
                                    h="160px"
                                    objectFit="cover"
                                    alt="AIに質問"
                                    mx="auto"
                                    display="block"
                                />
                                <Text>
                                    設問を把握したAIに分からなかった箇所を質問することで、学習が進みます
                                </Text>
                            </LearningStepCard>
                        </Flex>
                    </Box>
                </Box>
                {/* 試験概要 */}
                <Heading
                    size={{ base: "md", md: "xl" }}
                    color="baseColor"
                    textAlign="center"
                >
                    情報処理安全確保支援士試験とは
                </Heading>
                <Card>
                    <Flex gap={7} direction="column">
                        <Box textAlign="left">
                            <Text>
                                情報処理安全確保支援士試験は、ーーーーな試験です。
                                <br />
                                情報処理推進機構(IPA)が実施する国家試験の中で最高難易度(レベル4)に位置付けられており、合格率は例年19%前後で推移しています。
                                2026年よりCBT方式への移行に伴い、これまでの午前I試験は、科目A-1試験へ、午前Ⅱ試験は、科目A-2試験へ、午後試験は、科目B試験へと名称変更されます。
                                <br />
                                科目B試験(旧午後試験)は、試験時間150分、出題される4つの設問から2つを選択し、解答します。各設問は50点満点で、合計100点満点中60点以上で合格となります。
                                <br />
                            </Text>
                        </Box>
                    </Flex>
                </Card>
                {/* お知らせ */}
                <Card>
                    <Box mb={5}>
                        <Heading
                            size={{ base: "md", md: "xl" }}
                            color="baseColor"
                        >
                            <LuBell
                                style={{
                                    display: "inline",
                                    marginBottom: "-4px",
                                    marginRight: 2,
                                }}
                            />
                            お知らせ
                        </Heading>
                    </Box>
                    <DisplayNewsItemList />
                </Card>
            </Flex>
        </Box>
    );
});
