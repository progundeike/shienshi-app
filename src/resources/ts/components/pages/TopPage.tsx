import {
    Box,
    Flex,
    Heading,
    Text,
    Image,
    Button,
    Icon,
    SimpleGrid,
} from "@chakra-ui/react";
import { FC, memo } from "react";
import {
    LuAward,
    LuCalendarDays,
    LuChartBarIncreasing,
    LuChevronRight,
    LuFilePenLine,
    LuMessageSquareQuote,
    LuMonitor,
} from "react-icons/lu";
import { HiOutlineLightBulb } from "react-icons/hi";

import { Link } from "react-router-dom";
import { ExamInfoCard } from "../organisms/top-page/ExamInfoCard";
import { LearningStepCard } from "../atoms/LearningStepCard";
import { NewsItemSection } from "../organisms/NewsItemSection";
import { ExamSystemTransitionSection } from "../organisms/top-page/ExamSystemTransitionSection";
import { HeroSection } from "../organisms/top-page/HeroSection";

const LearningStepArrowIcon = () => {
    return (
        <Box display={{ base: "none", lg: "block" }} h="100%" my="auto">
            <Icon as={LuChevronRight} boxSize={12} color="baseColor" />
        </Box>
    );
};

const LearningStepBadge = ({ step }: { step: number }) => {
    return (
        <Flex justify="center">
            <Flex
                align="center"
                justify="center"
                w={{ base: "56px", md: "64px" }}
                h={{ base: "56px", md: "64px" }}
                borderRadius="full"
                bg="baseColor"
                color="white"
                flexShrink={0}
                direction="column"
                lineHeight="1"
                fontWeight="bold"
            >
                <Text
                    fontSize={{
                        base: "xs",
                        md: "md",
                    }}
                    letterSpacing="0.04em"
                >
                    STEP
                </Text>
                <Text
                    fontSize={{
                        base: "xs",
                        md: "xl",
                    }}
                    transform="translateX(-2px)"
                >
                    {step}
                </Text>
            </Flex>
        </Flex>
    );
};

export const TopPage: FC = memo(() => {
    return (
        <Box>
            <HeroSection />
            <Box
                maxW="1200px"
                w="100%"
                mx="auto"
                px={{ base: 4, md: 6 }}
                mb="50px"
            >
                <Flex gap={5} direction="column">
                    <Box my={10} textColor="black">
                        {/* サービスの特徴 */}
                        <Box
                            mx="auto"
                            mb={{ base: 2, md: 8 }}
                            textAlign="center"
                        >
                            <Heading
                                size={{ base: "md", md: "xl" }}
                                color="baseColor"
                                mb={5}
                            >
                                情報処理安全確保支援士試験の学習を、3ステップでサポート
                            </Heading>
                            <Flex
                                direction={{ base: "column", md: "row" }}
                                justifyContent="space-between"
                                gap={{ base: 5, md: 5 }}
                                align="stretch"
                            >
                                <LearningStepCard>
                                    <Flex alignItems="center" gap="4">
                                        <LearningStepBadge step={1} />
                                        <Text
                                            fontSize={{ base: "lg", md: "2xl" }}
                                            fontWeight={900}
                                        >
                                            過去問を解く
                                        </Text>
                                    </Flex>

                                    <Image
                                        src="/images/step1_image.svg"
                                        h="160px"
                                        objectFit="cover"
                                        alt="過去問を解く"
                                        mx="auto"
                                        display="block"
                                    />
                                    <Text>
                                        試験対策には過去問を解いて、実際の試験形式に慣れることが重要です。
                                    </Text>
                                </LearningStepCard>

                                <LearningStepArrowIcon />

                                <LearningStepCard>
                                    <Flex alignItems="center" gap="4">
                                        <LearningStepBadge step={2} />
                                        <Text
                                            fontSize={{ base: "lg", md: "2xl" }}
                                            fontWeight={900}
                                        >
                                            AIで添削
                                        </Text>
                                    </Flex>
                                    <Image
                                        src="/images/step2_image.svg"
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

                                <LearningStepArrowIcon />

                                <LearningStepCard>
                                    <Flex alignItems="center" gap="4">
                                        <LearningStepBadge step={3} />
                                        <Text
                                            fontSize={{ base: "lg", md: "2xl" }}
                                            fontWeight={900}
                                        >
                                            AIに質問
                                        </Text>
                                    </Flex>
                                    <Image
                                        src="/images/step3_image.svg"
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
                    <Flex gap={{ base: 2, md: 5 }} direction="column" mb={10}>
                        <Heading
                            size={{ base: "md", md: "xl" }}
                            color="baseColor"
                            textAlign="center"
                        >
                            - 情報処理安全確保支援士試験とは -
                        </Heading>
                        <Box
                            bg="white"
                            borderRadius="xl"
                            border="1px solid"
                            borderColor="gray.200"
                            p={7}
                        >
                            <Flex
                                gap={{ base: 5, md: 10 }}
                                direction={{ base: "column", md: "row" }}
                                align="center"
                            >
                                <Box
                                    h="160px"
                                    borderRadius="md"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    maxW={{ base: "100%", md: "240px" }}
                                    flexShrink={0}
                                    overflow="hidden"
                                >
                                    <Image
                                        src="/images/exam_info_image.png"
                                        w="100%"
                                        h="100%"
                                        objectFit="contain"
                                        alt="試験概要イメージ"
                                        display="block"
                                    />
                                </Box>
                                <Box>
                                    <Text
                                        fontSize={{ base: "md", md: "lg" }}
                                        fontWeight="bold"
                                        color="baseColor"
                                    >
                                        サイバーセキュリティの専門知識を活用し、組織の安全な情報システムを支える力を問う国家試験です。
                                    </Text>
                                    <Text
                                        mt={3}
                                        fontSize={{ base: "sm", md: "md" }}
                                    >
                                        情報処理安全確保支援士試験(SC)は、情報処理推進機構（IPA）が実施する国家試験の一つです。
                                        <br />
                                        セキュリティに関する専門知識を活用し、情報システムの企画・設計・開発・運用を安全面から支援する力が求められます。
                                        <br />
                                        合格後に登録を受けることで、国家資格「情報処理安全確保支援士(登録セキスペ)」の資格保持者となることができます。
                                    </Text>
                                </Box>
                            </Flex>
                        </Box>

                        <SimpleGrid
                            columns={{ base: 1, md: 3 }}
                            spacing={5}
                            alignItems="stretch"
                        >
                            <ExamInfoCard
                                icon={LuChartBarIncreasing}
                                subIcon={LuAward}
                                title="合格率は20%前後"
                                note="令和7年度春期 19.0%、秋期 22.3%"
                            >
                                <Text>
                                    IPAの試験区分の中でも高度な区分に位置付けられる試験です。
                                    知識の暗記だけでなく、問題文から条件を読み取り、根拠を整理する力が必要です。
                                </Text>
                            </ExamInfoCard>
                            <ExamInfoCard
                                icon={LuCalendarDays}
                                subIcon={LuMonitor}
                                title="2026年度からCBT方式へ"
                                note="知識・技能の範囲、出題形式、出題数、試験時間は変更なし"
                            >
                                <Text>
                                    2026年度からCBT方式での実施に移行されました。
                                    受験日時は、一定期間内の複数日から会場ごとの予約枠を選ぶ方式へと変更されました。
                                </Text>
                            </ExamInfoCard>
                            <ExamInfoCard
                                icon={LuFilePenLine}
                                subIcon={LuMessageSquareQuote}
                                title="科目Bで求められる力"
                                note="旧午後試験に相当する記述式対策が重要"
                            >
                                <Text>
                                    CBT方式へ移行後、午後試験は「科目B試験」という名称になります。
                                    科目Bでは、長文の問題文を正確に読み、設問の意図を把握したうえで、根拠のある解答を構成する力が問われます。
                                </Text>
                            </ExamInfoCard>
                        </SimpleGrid>

                        <Flex
                            direction={{ base: "column", md: "row" }}
                            align="center"
                            justify="space-between"
                            gap={4}
                            bg="yellow.50"
                            border="1px solid"
                            borderColor="yellow.200"
                            borderRadius="xl"
                            p={{ base: 4, md: 6 }}
                        >
                            <Flex align="center" gap={{ base: 3, md: 5 }}>
                                <Flex
                                    align="center"
                                    justify="center"
                                    w={{ base: 12, md: 14 }}
                                    h={{ base: 12, md: 14 }}
                                    borderRadius="full"
                                    // bg="yellow.100"
                                    color="yellow.500"
                                    flexShrink={0}
                                >
                                    <Icon
                                        as={HiOutlineLightBulb}
                                        boxSize={{ base: 8, md: 16 }}
                                    />
                                </Flex>
                                <Box>
                                    <Text
                                        fontWeight="bold"
                                        color="baseColor"
                                        fontSize={{ base: "sm", md: "2xl" }}
                                        mb={1}
                                    >
                                        支援士対策室は科目Bに特化！
                                    </Text>
                                    <Text
                                        fontSize={{ base: "sm", md: "md" }}
                                        color="gray.700"
                                    >
                                        旧午後試験に相当する科目Bに向けて、過去問演習・AI添削・AIへの質問をひとつの流れで行えます。
                                    </Text>
                                </Box>
                            </Flex>
                            <Button
                                as={Link}
                                to="/exams"
                                bg="baseColor"
                                color="white"
                                borderRadius="md"
                                px={8}
                                flexShrink={0}
                                _hover={{ bg: "blue.600", boxShadow: "lg" }}
                            >
                                まずは過去問を見てみる ＞
                            </Button>
                        </Flex>
                    </Flex>

                    {/* お知らせ */}
                    <NewsItemSection />
                </Flex>
            </Box>
        </Box>
    );
});
