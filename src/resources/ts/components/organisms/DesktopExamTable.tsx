import { FC, memo, ReactNode } from "react";
import { Box, Text, Flex } from "@chakra-ui/react";
import { ExamLinkButton } from "../atoms/ExamLinkButton";
import { PreReleaseExamLinkButton } from "../atoms/PreReleaseExamLinkButton";
import { SubmittedExam } from "../../types/exam";
import { HashRouter } from "react-router-dom";

const ExamListCard: FC<{
    children: ReactNode;
    title: string;
    subTitle?: string;
}> = ({ children, title, subTitle }) => {
    return (
        <Flex
            boxShadow="md"
            p={3}
            w="100%"
            borderRadius="xl"
            border="1px solid"
            borderColor="gray.200"
            justifyContent="space-between"
            alignItems="center"
        >
            <Box w="30%">
                <Text fontSize="xl" fontWeight="bold">
                    {title}
                </Text>
                <Text color="gray.700">{subTitle}</Text>
            </Box>
            <Flex gap={4} w="60%">
                {children}
            </Flex>
        </Flex>
    );
};

type Props = {
    submittedExams: SubmittedExam[];
};

export const DesktopExamTable: FC<Props> = memo(({ submittedExams }) => {
    const isSubmitted = (year: number, season: string, section: number) => {
        return submittedExams.some(
            (exam) =>
                exam.year === year &&
                exam.season === season &&
                exam.section === section,
        );
    };

    return (
        <Box>
            <Flex direction="column" gap={5}>
                <ExamListCard title="2025年(令和7年) 秋期">
                    <ExamLinkButton
                        url="2025/aki/1"
                        title="問1"
                        isSubmitted={isSubmitted(2025, "aki", 1)}
                    />
                    <ExamLinkButton
                        url="2025/aki/2"
                        title="問2"
                        isSubmitted={isSubmitted(2025, "aki", 2)}
                    />
                    <ExamLinkButton
                        url="2025/aki/3"
                        title="問3"
                        isSubmitted={isSubmitted(2025, "aki", 3)}
                    />
                    <ExamLinkButton
                        url="2025/aki/4"
                        title="問4"
                        isSubmitted={isSubmitted(2025, "aki", 4)}
                    />
                </ExamListCard>

                <ExamListCard title="2025年(令和7年) 春期">
                    <ExamLinkButton
                        url="2025/haru/1"
                        title="問1"
                        isSubmitted={isSubmitted(2025, "haru", 1)}
                    />
                    <ExamLinkButton
                        url="2025/haru/2"
                        title="問2"
                        isSubmitted={isSubmitted(2025, "haru", 2)}
                    />
                    <ExamLinkButton
                        url="2025/haru/3"
                        title="問3"
                        isSubmitted={isSubmitted(2025, "haru", 3)}
                    />
                    <ExamLinkButton
                        url="2025/haru/4"
                        title="問4"
                        isSubmitted={isSubmitted(2025, "haru", 4)}
                    />
                </ExamListCard>

                <ExamListCard title="2024年(令和6年) 秋期">
                    <ExamLinkButton
                        url="2024/aki/1"
                        title="問1"
                        isSubmitted={isSubmitted(2024, "aki", 1)}
                    />
                    <ExamLinkButton
                        url="2024/aki/2"
                        title="問2"
                        isSubmitted={isSubmitted(2024, "aki", 2)}
                    />
                    <ExamLinkButton
                        url="2024/aki/3"
                        title="問3"
                        isSubmitted={isSubmitted(2024, "aki", 3)}
                    />
                    <ExamLinkButton
                        url="2024/aki/4"
                        title="問4"
                        isSubmitted={isSubmitted(2024, "aki", 4)}
                    />
                </ExamListCard>

                <ExamListCard title="2024年(令和6年) 春期">
                    <ExamLinkButton
                        url="2024/haru/1"
                        title="問1"
                        isSubmitted={isSubmitted(2024, "haru", 1)}
                    />
                    <ExamLinkButton
                        url="2024/haru/2"
                        title="問2"
                        isSubmitted={isSubmitted(2024, "haru", 2)}
                    />
                    <ExamLinkButton
                        url="2024/haru/3"
                        title="問3"
                        isSubmitted={isSubmitted(2024, "haru", 3)}
                    />
                    <ExamLinkButton
                        url="2024/haru/4"
                        title="問4"
                        isSubmitted={isSubmitted(2024, "haru", 4)}
                    />
                </ExamListCard>

                <ExamListCard title="2023年(令和5年) 秋期">
                    <ExamLinkButton
                        url="2023/aki/1"
                        title="問1"
                        isSubmitted={isSubmitted(2023, "aki", 1)}
                    />
                    <ExamLinkButton
                        url="2023/aki/2"
                        title="問2"
                        isSubmitted={isSubmitted(2023, "aki", 2)}
                    />
                    <ExamLinkButton
                        url="2023/aki/3"
                        title="問3"
                        isSubmitted={isSubmitted(2023, "aki", 3)}
                    />
                    <ExamLinkButton
                        url="2023/aki/4"
                        title="問4"
                        isSubmitted={isSubmitted(2023, "aki", 4)}
                    />
                </ExamListCard>
            </Flex>
        </Box>
    );
});
