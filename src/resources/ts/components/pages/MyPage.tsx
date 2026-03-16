import { FC, memo, useEffect, useState } from "react";
import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { LogoutButton } from "../atoms/LogoutButton";
import { userAtom } from "../../states/userAtom";
import { Link, useNavigate } from "react-router-dom";
import { useAtomValue } from "jotai";
import { SubmittedExam, useExam } from "../../hooks/useExam";
import { AccountDeleteModal } from "../organisms/AccountDeleteModal";

export const MyPage: FC = memo(() => {
    const user = useAtomValue(userAtom);
    const { fetchSubmittedExams } = useExam();
    const [submittedExams, setSubmittedExams] = useState<SubmittedExam[]>([]);

    const navigate = useNavigate();

    if (!user) {
        navigate("/login");
        return;
    }

    useEffect(() => {
        const getSubmittedExams = async () => {
            const submittedExams = await fetchSubmittedExams();
            setSubmittedExams(submittedExams || []);
        };

        getSubmittedExams();
    }, []);

    return (
        <Box mt="20px">
            <Flex flexFlow="column" gap="20px" w="80%" m="auto">
                <Flex justify={"space-between"} alignItems={"center"}>
                    <Heading size="md">{user.username}さんのマイページ</Heading>
                    <Flex gap="10px">
                        <Link to="/update-password">
                            <Button
                                borderRadius="full"
                                shadow="md"
                                outline={"1px solid"}
                            >
                                パスワード変更
                            </Button>
                        </Link>
                        <LogoutButton />
                    </Flex>
                </Flex>

                {/* 学習履歴 */}
                <Box>
                    <Box my="10px">
                        <Heading size="md">提出済みの答案</Heading>
                    </Box>
                    {submittedExams.length === 0 ? (
                        <Box>提出済みの答案はありません。</Box>
                    ) : (
                        <Flex flexDirection="column" gap="10px">
                            {submittedExams.map((exam) => (
                                <Button
                                    outline="0.5px solid"
                                    borderRadius="100px"
                                    key={`${exam.year}-${exam.season}-${exam.section}`}
                                    maxW="300px"
                                    shadow="md"
                                >
                                    <Link
                                        to={`/exams/${exam.year}/${exam.season}/${exam.section}`}
                                    >
                                        {`${exam.year}年 ${exam.season_japanese} ${exam.section_converted}`}
                                    </Link>
                                </Button>
                            ))}
                        </Flex>
                    )}
                </Box>

                <AccountDeleteModal />
            </Flex>
        </Box>
    );
});
