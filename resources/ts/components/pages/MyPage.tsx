import { FC, memo, useEffect, useState } from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
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
                        outline="0.5px solid"
                        p="10px"
                        borderRadius="100px"
                        backgroundColor="blue.100"
                    >
                        <Flex alignItems="center">
                            <FaExclamationCircle size="25px" />

                            <Box ml="10px">
                                メールアドレスが未登録です。メールアドレスを登録することで、パスワードを忘れてしまっても再設定が可能になります。
                            </Box>
                        </Flex>
                    </Box>
                )}

                {/* 学習履歴 */}
                <Box>
                    <Text>提出済みの答案</Text>
                    {submittedExams.length === 0 ? (
                        <Box>提出済みの答案はありません。</Box>
                    ) : (
                        <Box>
                            {submittedExams.map((exam) => (
                                <Box
                                    key={`${exam.year}-${exam.season}-${exam.section}`}
                                >
                                    <Link
                                        to={`/exams/${exam.year}/${exam.season}/${exam.section}`}
                                    >
                                        <Button>
                                            {`${exam.year}年 ${exam.season_japanese} ${exam.section_converted}`}
                                        </Button>
                                    </Link>
                                </Box>
                            ))}
                        </Box>
                    )}
                </Box>
            </Flex>
        </Box>
    );
});
