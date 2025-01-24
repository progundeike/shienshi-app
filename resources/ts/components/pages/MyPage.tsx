import { FC, memo, useEffect, useState } from "react";
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { LogoutButton } from "../atoms/LogoutButton";
import { userAtom } from "../../states/userAtom";
import { Link, useNavigate } from "react-router-dom";
import { useAtomValue } from "jotai";
import { FaExclamationCircle } from "react-icons/fa";
import { SubmittedExam, useExam } from "../../hooks/useExam";

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
                    <Box fontSize={"x-large"}>
                        {user.username}さんの学習履歴
                    </Box>
                    <LogoutButton />
                </Flex>

                {!user.emailVerified && (
                    <Box
                        // outline="0.5px solid"
                        p="10px"
                        borderRadius="10px"
                        backgroundColor="blue.100"
                        padding="20px"
                    >
                        <Flex alignItems="center">
                            <FaExclamationCircle size="25px" />

                            <Box ml="10px">
                                メールアドレスが未登録です。メールアドレスを登録することで、パスワードを忘れてしまっても再設定が可能になります。
                            </Box>
                            <Box>
                                <Button
                                    borderRadius="100px"
                                    ml="10px"
                                    outline="0.5px solid"
                                >
                                    メールアドレスを登録
                                </Button>
                            </Box>
                        </Flex>
                    </Box>
                )}

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
                                <Link
                                    key={`${exam.year}-${exam.season}-${exam.section}`}
                                    to={`/exams/${exam.year}/${exam.season}/${exam.section}`}
                                >
                                    <Button
                                        outline="0.5px solid"
                                        borderRadius="100px"
                                    >
                                        {`${exam.year}年 ${exam.season_japanese} ${exam.section_converted}`}
                                    </Button>
                                </Link>
                            ))}
                        </Flex>
                    )}
                </Box>
            </Flex>
        </Box>
    );
});
