import { FC, memo, useEffect, useState } from "react";
import { Box, Button, Flex, Heading, Modal, Text } from "@chakra-ui/react";
import { LogoutButton } from "../atoms/LogoutButton";
import { userAtom } from "../../states/userAtom";
import { Link, useNavigate } from "react-router-dom";
import { useAtomValue } from "jotai";
import { FaExclamationCircle } from "react-icons/fa";
import { SubmittedExam, useExam } from "../../hooks/useExam";
import { UpdatePasswordPage } from "./auth/UpdatePasswordPage";
import { RiFileExcel2Line } from "react-icons/ri";
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
        console.log(user);
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

                {user.emailVerified ? (
                    // TODO: メールアドレスが登録済みの場合の表示
                    <Box>メールアドレスが登録済みです</Box>
                ) : (
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
                                メールアドレスが未登録です。メールアドレスを登録することで、パスワードを忘れても再設定が可能になります。
                            </Box>
                            <Link to="/register-email">
                                <Button
                                    borderRadius="full"
                                    ml="10px"
                                    outline="1px solid"
                                    shadow="md"
                                >
                                    メールアドレスを登録
                                </Button>
                            </Link>
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

                <AccountDeleteModal />
            </Flex>
        </Box>
    );
});
