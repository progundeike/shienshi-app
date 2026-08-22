import { FC, memo, useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { Box, Image, Text, Heading, Flex } from "@chakra-ui/react";

import { MobileExamsList } from "../organisms/MobileExamsList";
import { useExam } from "../../hooks/useExam";
import { DesktopExamTable } from "../organisms/DesktopExamTable";
import { userAtom } from "../../states/userAtom";
import type { SubmittedExam } from "../../types/exam";

export const ExamsListPage: FC = memo(() => {
    const { fetchSubmittedExams } = useExam();
    const [submittedExams, setSubmittedExams] = useState<SubmittedExam[]>([]);
    const user = useAtomValue(userAtom);

    useEffect(() => {
        if (!user) {
            setSubmittedExams([]);
            return;
        }

        const getSubmittedExams = async () => {
            const submittedExams = await fetchSubmittedExams();
            setSubmittedExams(submittedExams || []);
        };

        getSubmittedExams();
    }, [user]);

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
                            <DesktopExamTable submittedExams={submittedExams} />
                        </Box>

                        <Box display={{ base: "block", md: "none" }}>
                            <MobileExamsList submittedExams={submittedExams} />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
});
