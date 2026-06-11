import { FC, memo, useEffect, useState } from "react";
import {
    Box,
    Button,
    Flex,
    Heading,
    Icon,
    Progress,
    SimpleGrid,
    Text,
    Image,
    Grid,
} from "@chakra-ui/react";
import { LogoutButton } from "../atoms/LogoutButton";
import { userAtom } from "../../states/userAtom";
import { Link, useNavigate } from "react-router-dom";
import { useAtomValue } from "jotai";
import { SubmittedExam } from "../../types/exam";
import { AccountDeleteModal } from "../organisms/AccountDeleteModal";
import { useExam } from "../../hooks/useExam";
import {
    LuChartNoAxesColumnIncreasing,
    LuCircleCheckBig,
    LuFileText,
    LuLockKeyhole,
} from "react-icons/lu";
import { HiOutlineLightBulb } from "react-icons/hi";

const TOTAL_EXAMS_COUNT = 16;

export const MyPage: FC = memo(() => {
    const user = useAtomValue(userAtom);
    const { fetchSubmittedExams } = useExam();
    const [submittedExams, setSubmittedExams] = useState<SubmittedExam[]>([]);
    const completedRate =
        TOTAL_EXAMS_COUNT > 0
            ? (submittedExams.length / TOTAL_EXAMS_COUNT) * 100
            : 0;

    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    useEffect(() => {
        const getSubmittedExams = async () => {
            const submittedExams = await fetchSubmittedExams();
            setSubmittedExams(submittedExams || []);
        };

        getSubmittedExams();
    }, []);

    if (!user) {
        return null;
    }

    return (
        <Box mt="20px" maxW="1200px" mx="auto">
            <Flex flexFlow="column" gap="20px" w="80%" m="auto">
                <Flex
                    justify={"space-between"}
                    alignItems={"center"}
                    direction={{ base: "column", md: "row" }}
                    gap={{ base: 4, md: 0 }}
                >
                    <Flex direction="column" gap={3}>
                        <Text fontSize="xl" fontWeight="bold">
                            {user.username}さん、こんにちは!
                        </Text>
                        <Text>今日も一緒に学習を進めていきましょう</Text>
                    </Flex>
                    <Flex
                        gap="10px"
                        w={{ base: "100%", md: "auto" }}
                        justify={{ base: "space-between", md: "flex-start" }}
                    >
                        <Button
                            as={Link}
                            to="/update-password"
                            bg="white"
                            borderRadius="full"
                            shadow="md"
                            size={{ base: "sm", md: "md" }}
                            border="1px solid"
                            borderColor="baseColor"
                            leftIcon={<LuLockKeyhole />}
                        >
                            パスワード変更
                        </Button>
                        <LogoutButton />
                    </Flex>
                </Flex>

                {/* 学習状況 */}
                <Box
                    bg="white"
                    p={{ base: 5, md: 7 }}
                    borderRadius="2xl"
                    border="1px solid"
                    borderColor="gray.100"
                    boxShadow="sm"
                >
                    <Grid
                        templateColumns={{ base: "1fr", md: "2fr 1fr" }}
                        gap={{ base: 6, md: 8 }}
                        alignItems="stretch"
                    >
                        <Box minW={0}>
                            <Flex
                                justify="space-between"
                                align={{ base: "start", md: "center" }}
                                direction={{ base: "column", md: "row" }}
                                gap={2}
                                mb={5}
                            >
                                <Box>
                                    <Heading size="md">
                                        あなたの学習状況
                                    </Heading>
                                    <Text fontSize="sm" color="gray.500" mt={1}>
                                        これまでの学習進捗を確認できます
                                    </Text>
                                </Box>
                            </Flex>

                            <SimpleGrid
                                columns={{ base: 1, md: 2 }}
                                spacing={4}
                            >
                                <Flex
                                    align="center"
                                    gap={4}
                                    bg="blue.50"
                                    borderRadius="xl"
                                    p={{ base: 4, md: 5 }}
                                    border="1px solid"
                                    borderColor="blue.100"
                                >
                                    <Flex
                                        align="center"
                                        justify="center"
                                        w={{ base: 12, md: 14 }}
                                        h={{ base: 12, md: 14 }}
                                        borderRadius="full"
                                        bg="white"
                                        color="blue.500"
                                        flexShrink={0}
                                        boxShadow="sm"
                                    >
                                        <Icon
                                            as={LuCircleCheckBig}
                                            boxSize={{ base: 6, md: 7 }}
                                        />
                                    </Flex>

                                    <Box>
                                        <Text fontSize="sm" color="gray.600">
                                            解いた問題数
                                        </Text>
                                        <Flex
                                            align="baseline"
                                            gap={1}
                                            justify="right"
                                        >
                                            <Text
                                                fontSize={{
                                                    base: "3xl",
                                                    md: "4xl",
                                                }}
                                                fontWeight="bold"
                                                color="gray.800"
                                                lineHeight="1"
                                            >
                                                {submittedExams.length}
                                            </Text>
                                            <Text
                                                fontSize="sm"
                                                color="gray.600"
                                            >
                                                問
                                            </Text>
                                        </Flex>
                                    </Box>
                                </Flex>

                                <Box
                                    bg="gray.50"
                                    borderRadius="xl"
                                    p={{ base: 4, md: 5 }}
                                    border="1px solid"
                                    borderColor="gray.100"
                                >
                                    <Flex align="center" gap={4} mb={4}>
                                        <Flex
                                            align="center"
                                            justify="center"
                                            w={{ base: 12, md: 14 }}
                                            h={{ base: 12, md: 14 }}
                                            borderRadius="full"
                                            bg="white"
                                            color="blue.500"
                                            flexShrink={0}
                                            boxShadow="sm"
                                        >
                                            <Icon
                                                as={
                                                    LuChartNoAxesColumnIncreasing
                                                }
                                                boxSize={{ base: 6, md: 7 }}
                                            />
                                        </Flex>

                                        <Box>
                                            <Text
                                                fontSize="sm"
                                                color="gray.600"
                                            >
                                                登録済み過去問の進捗
                                            </Text>
                                            <Flex
                                                align="baseline"
                                                gap={1}
                                                justify="center"
                                            >
                                                <Text
                                                    fontSize={{
                                                        base: "3xl",
                                                        md: "4xl",
                                                    }}
                                                    fontWeight="bold"
                                                    color="gray.800"
                                                    lineHeight="1"
                                                >
                                                    {completedRate.toFixed(1)}
                                                </Text>
                                                <Text
                                                    fontSize="sm"
                                                    color="gray.600"
                                                >
                                                    %
                                                </Text>
                                            </Flex>
                                        </Box>
                                    </Flex>

                                    <Progress
                                        value={completedRate}
                                        colorScheme="blue"
                                        borderRadius="full"
                                        bg="gray.200"
                                        h="8px"
                                    />

                                    <Text
                                        fontSize="xs"
                                        color="gray.500"
                                        mt={2}
                                        textAlign="right"
                                    >
                                        全{TOTAL_EXAMS_COUNT}問中{" "}
                                        {submittedExams.length}問完了
                                    </Text>
                                </Box>
                            </SimpleGrid>
                        </Box>
                        <Flex justify="center" align="center" h="100%">
                            <Image
                                src="/images/my_page_step_image.png"
                                w={{ base: "220px", md: "100%" }}
                                maxW="300px"
                                h="auto"
                                objectFit="contain"
                            />
                        </Flex>
                    </Grid>
                </Box>

                {/* 提出履歴 */}
                <Box
                    bg="white"
                    p={{ base: 4, md: 7 }}
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="gray.200"
                >
                    <Box mb="20px">
                        <Heading size="md">提出済みの答案</Heading>
                    </Box>
                    {submittedExams.length === 0 ? (
                        <Box>提出済みの答案はありません。</Box>
                    ) : (
                        <Flex flexDirection="column" gap="10px">
                            {submittedExams.map((exam) => (
                                <Flex
                                    bg="white"
                                    key={`${exam.year}-${exam.season}-${exam.section}`}
                                    alignItems="center"
                                    justifyContent="space-between"
                                    border="1px solid"
                                    borderColor="gray.200"
                                    p={{ base: 1, md: 2 }}
                                    borderRadius="xl"
                                    boxShadow="sm"
                                >
                                    <Flex alignItems="center" gap={4}>
                                        <Flex
                                            align="center"
                                            justify="center"
                                            boxSize={{
                                                base: "36px",
                                                md: "44px",
                                            }}
                                            borderRadius="full"
                                            bg="blue.100"
                                            flexShrink={0}
                                        >
                                            <Icon
                                                as={LuFileText}
                                                boxSize={{ base: 5, md: 6 }}
                                            />
                                        </Flex>
                                        <Text
                                            fontWeight="bold"
                                            fontSize={{
                                                base: "md",
                                                md: "lg",
                                            }}
                                        >{`${exam.year}年 ${exam.season_japanese} ${exam.section_converted}`}</Text>
                                    </Flex>
                                    <Button
                                        as={Link}
                                        to={`/exams/${exam.year}/${exam.season}/${exam.section}`}
                                        border="1px solid"
                                        bg="white"
                                        borderColor="baseColor"
                                        borderRadius="100px"
                                        maxW="300px"
                                        shadow="md"
                                        size={{ base: "sm", md: "md" }}
                                    >
                                        添削を確認
                                    </Button>
                                </Flex>
                            ))}
                        </Flex>
                    )}
                </Box>

                <Box
                    bg="white"
                    p={{ base: 4, md: 7 }}
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="gray.200"
                >
                    <Flex gap={5}>
                        <Flex
                            align="center"
                            justify="center"
                            w={{ base: 12, md: 14 }}
                            h={{ base: 12, md: 14 }}
                            borderRadius="full"
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
                                fontSize={{ base: "md", md: "lg" }}
                                fontWeight="bold"
                                color="blue.500"
                            >
                                継続は力なり!
                            </Text>
                            <Text>
                                コツコツ積み重ねが合格への近道です。今日も一歩ずつ進めていきましょう。
                            </Text>
                        </Box>
                    </Flex>
                </Box>

                <AccountDeleteModal />
            </Flex>
        </Box>
    );
});
