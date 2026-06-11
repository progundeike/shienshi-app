import {
    Box,
    Flex,
    Button,
    Text,
    Icon,
    List,
    ListItem,
    UnorderedList,
} from "@chakra-ui/react";
import { memo } from "react";
import { IconType } from "react-icons";
import {
    LuChevronRight,
    LuClipboardPenLine,
    LuLandmark,
    LuShieldCheck,
} from "react-icons/lu";
import { ExamPeriodCard } from "./ExamPeriodCard";
import { IoInformationCircle } from "react-icons/io5";

const ExamChangeIcon = ({ icon }: { icon: IconType }) => {
    return (
        <Flex
            align="center"
            justify="center"
            w={{ base: "44px", md: "50px" }}
            h={{ base: "44px", md: "50px" }}
            color="#D97706"
            flexShrink={0}
        >
            <Icon as={icon} boxSize={{ base: 6, md: 12 }} />
        </Flex>
    );
};

export const ExamSystemTransitionSection = memo(() => {
    return (
        <Box
            h="100%"
            w="100%"
            bg="white"
            borderRadius={5}
            border="1px solid"
            borderColor="#CCCCCC"
            textAlign="center"
            shadow="md"
            p={5}
            mb={5}
            fontSize={{ base: "sm", md: "md" }}
        >
            <Flex gap={4} alignItems="center">
                <Flex
                    bg="red.500"
                    color="white"
                    borderRadius="2xl"
                    px={4}
                    alignItems="center"
                >
                    New
                </Flex>
                <Box>
                    <Text
                        color="baseColor"
                        fontSize={{ base: "sm", md: "xl" }}
                        fontWeight="bold"
                    >
                        2027年度から情報処理技術者試験制度が見直されます
                    </Text>
                </Box>
            </Flex>
            <Box textAlign="left" fontSize={{ base: "sm", md: "md" }} my={5}>
                <Text>
                    IPA(情報処理推進機構)は情報処理技術者試験の制度見直しを発表しました。
                    <br />
                    情報処理安全確保支援士試験は独立した試験区分として存続しますが、試験の仕組みや出題形式が変更される予定です。
                </Text>
            </Box>

            <Box>
                <Flex
                    gap={{ base: 3, md: 1 }}
                    direction={{ base: "column", md: "row" }}
                >
                    <ExamPeriodCard
                        yearLabel="2025年度まで (旧方式)"
                        color="blue.600"
                        title="午前Ⅰ・午前Ⅱ・午後の構成で実施"
                    >
                        <Box textAlign="left">
                            <Box
                                bg="blue.50"
                                border="1px solid"
                                borderColor="blue.200"
                                borderRadius="xl"
                                p={3}
                                mb={3}
                            >
                                <Text
                                    color="blue.700"
                                    fontWeight="bold"
                                    fontSize={{ base: "sm", md: "md" }}
                                    mb={2}
                                >
                                    試験構成
                                </Text>

                                <Flex direction="column" gap={1}>
                                    <Text
                                        fontSize={{ base: "xs", md: "sm" }}
                                        color="gray.700"
                                    >
                                        午前Ⅰ：四肢択一 / 30問
                                    </Text>

                                    <Text
                                        fontSize={{ base: "xs", md: "sm" }}
                                        color="gray.700"
                                    >
                                        午前Ⅱ：四肢択一 / 25問
                                    </Text>

                                    <Text
                                        fontSize={{ base: "xs", md: "sm" }}
                                        color="gray.700"
                                    >
                                        午後：記述式 / 150分 / 4問中2問解答
                                    </Text>
                                </Flex>
                            </Box>

                            <Box
                                bg="white"
                                border="1px dashed"
                                borderColor="blue.300"
                                borderRadius="xl"
                                p={3}
                            >
                                <Text
                                    color="blue.700"
                                    fontWeight="bold"
                                    fontSize={{ base: "sm", md: "md" }}
                                    mb={1}
                                >
                                    支援士対策室の中心範囲
                                </Text>

                                <Text
                                    color="gray.700"
                                    fontSize={{ base: "xs", md: "sm" }}
                                    lineHeight="1.7"
                                >
                                    旧午後試験の過去問を使い、長文読解・根拠整理・記述解答の練習を行います。
                                </Text>
                            </Box>
                        </Box>
                    </ExamPeriodCard>

                    <Box
                        display={{ base: "none", lg: "block" }}
                        h="100%"
                        my="auto"
                    >
                        <Icon
                            as={LuChevronRight}
                            boxSize={8}
                            color="baseColor"
                        />
                    </Box>

                    <ExamPeriodCard
                        yearLabel="2026年度 (現行)"
                        color="green.600"
                        title="CBT方式へ移行"
                    >
                        <Flex direction="column" gap={3} textAlign="left">
                            <Box
                                bg="green.50"
                                border="1px solid"
                                borderColor="green.200"
                                borderRadius="xl"
                                p={4}
                            >
                                <Text
                                    color="green.700"
                                    fontWeight="bold"
                                    fontSize={{ base: "sm", md: "md" }}
                                    mb={3}
                                    textAlign="center"
                                >
                                    2026年度の実施予定
                                </Text>

                                <Text>春期・秋期から前期・後期へ</Text>

                                <Text
                                    fontWeight="bold"
                                    color="green.700"
                                    fontSize="sm"
                                >
                                    前期試験
                                </Text>

                                <Text color="gray.700" fontSize="sm">
                                    2026年11月頃
                                </Text>

                                <Text
                                    fontWeight="bold"
                                    color="green.700"
                                    fontSize="sm"
                                >
                                    後期試験
                                </Text>

                                <Text color="gray.700" fontSize="sm">
                                    2027年2月頃
                                </Text>

                                <Text
                                    fontWeight="bold"
                                    color="green.700"
                                    fontSize="sm"
                                >
                                    名称変更
                                </Text>

                                <Text color="gray.700" fontSize="sm">
                                    午後 → 科目B
                                </Text>
                            </Box>

                            <Box
                                bg="white"
                                border="1px solid"
                                borderColor="green.200"
                                borderRadius="xl"
                                p={4}
                                boxShadow="sm"
                            >
                                <Text
                                    color="green.700"
                                    fontWeight="bold"
                                    fontSize={{ base: "sm", md: "md" }}
                                    mb={2}
                                >
                                    出題内容には変更なし
                                </Text>

                                <Text
                                    color="gray.700"
                                    fontSize={{ base: "xs", md: "sm" }}
                                    lineHeight="1.7"
                                >
                                    2026年度はCBT方式へ移行しますが、知識・技能の範囲、出題形式、出題数、試験時間は変更なしとされています。
                                </Text>
                            </Box>
                        </Flex>
                    </ExamPeriodCard>

                    <Box
                        display={{ base: "none", lg: "block" }}
                        h="100%"
                        my="auto"
                    >
                        <Icon
                            as={LuChevronRight}
                            boxSize={8}
                            color="green.600"
                        />
                    </Box>

                    <ExamPeriodCard
                        yearLabel="2027年度以降 (予定)"
                        color="#D97706"
                        title="新試験制度へ移行予定"
                    >
                        <Flex
                            align="center"
                            gap={3}
                            bg="#FFF7ED"
                            p={3}
                            border="1px solid"
                            borderColor="#FDBA74"
                            borderRadius="xl"
                        >
                            <ExamChangeIcon icon={LuLandmark} />
                            <Box textAlign="left">
                                <Text
                                    color="#9A3412"
                                    fontWeight="bold"
                                    fontSize={{ base: "sm", md: "md" }}
                                >
                                    高度試験の多くが再編
                                </Text>

                                <Text
                                    color="gray.700"
                                    fontSize={{ base: "xs", md: "sm" }}
                                    lineHeight="1.6"
                                >
                                    現行の高度試験区分の多くは、新しいプロフェッショナル系試験へ再編される予定です。
                                </Text>
                            </Box>
                        </Flex>

                        <Flex
                            align="center"
                            gap={3}
                            bg="#FFF7ED"
                            p={3}
                            border="1px solid"
                            borderColor="#FDBA74"
                            borderRadius="xl"
                        >
                            <ExamChangeIcon icon={LuShieldCheck} />

                            <Box textAlign="left">
                                <Text
                                    color="#9A3412"
                                    fontWeight="bold"
                                    fontSize={{ base: "sm", md: "md" }}
                                >
                                    支援士試験は存続予定
                                </Text>

                                <Text
                                    color="gray.700"
                                    fontSize={{ base: "xs", md: "sm" }}
                                    lineHeight="1.6"
                                >
                                    現行の高度試験区分の多くは、新しいプロフェッショナル系試験へ再編される予定です。
                                </Text>
                            </Box>
                        </Flex>

                        <Flex
                            align="center"
                            gap={3}
                            bg="#FFF7ED"
                            p={3}
                            border="1px solid"
                            borderColor="#FDBA74"
                            borderRadius="xl"
                        >
                            <ExamChangeIcon icon={LuClipboardPenLine} />

                            <Box textAlign="left">
                                <Text
                                    color="#9A3412"
                                    fontWeight="bold"
                                    fontSize={{ base: "sm", md: "md" }}
                                >
                                    科目Bは記述式から多肢選択式へ
                                </Text>

                                <Text
                                    color="gray.700"
                                    fontSize={{ base: "xs", md: "sm" }}
                                    lineHeight="1.6"
                                >
                                    <UnorderedList>
                                        <ListItem>試験時間は120分</ListItem>
                                        <ListItem>12問(全問必須解答)</ListItem>
                                        <ListItem>多肢選択式</ListItem>
                                    </UnorderedList>
                                </Text>
                            </Box>
                        </Flex>

                        <Box
                            bg="#FFF7ED"
                            border="1px solid"
                            borderColor="#FDBA74"
                            borderRadius="xl"
                            p={3}
                            mb={3}
                        >
                            <Text
                                color="#9A3412"
                                fontWeight="bold"
                                fontSize={{ base: "sm", md: "md" }}
                                mb={2}
                            >
                                試験構成
                            </Text>

                            <Flex direction="column" gap={1} textAlign="left">
                                <Text color="gray.700">
                                    科目A-1：四肢択一 / 45分 / 30問
                                </Text>

                                <Text color="gray.700">
                                    科目A-2：四肢択一 / 35分 / 25問
                                </Text>

                                <Text color="gray.700">
                                    科目 B ：多肢選択式/120分/12問(全問解答)
                                </Text>
                            </Flex>
                        </Box>
                    </ExamPeriodCard>
                </Flex>
            </Box>

            <Flex
                direction="row"
                my={{ base: 2, md: 4 }}
                p={{ base: 2, md: 4 }}
                border="1px dashed"
                borderColor="blue.300"
                borderRadius="md"
                gap={3}
            >
                <Icon
                    as={IoInformationCircle}
                    color="baseColor"
                    boxSize={{ base: 6, md: 10 }}
                />
                <Text textAlign="left">
                    ※2027年以降の内容は、IPAが公表している情報処理技術者試験及び情報処理安全確保支援士試験の見直しの検討状況について(2026年4月)に基づく情報です。
                    今後変更や更新される可能性がありますので、最新情報はIPA公式サイトから必ずご確認ください。
                </Text>
            </Flex>
        </Box>
    );
});
