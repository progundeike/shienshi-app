import { FC, memo, ReactNode } from "react";
import { Box, Text, Flex } from "@chakra-ui/react";
import { ExamLinkButton } from "../atoms/ExamLinkButton";
import { PreReleaseExamLinkButton } from "../atoms/PreReleaseExamLinkButton";

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

export const DesktopExamTable: FC = memo(() => {
    return (
        <Box>
            <Flex direction="column" gap={5}>
                <ExamListCard title="2025年(令和7年) 秋期" subTitle="編集中">
                    <PreReleaseExamLinkButton url="2025/aki/1" title="問1" />
                    <PreReleaseExamLinkButton url="2025/aki/2" title="問2" />
                    <PreReleaseExamLinkButton url="2025/aki/3" title="問3" />
                    <PreReleaseExamLinkButton url="2025/aki/4" title="問4" />
                </ExamListCard>

                <ExamListCard title="2025年(令和7年) 春期">
                    <ExamLinkButton url="2025/haru/1" title="問1" />
                    <ExamLinkButton url="2025/haru/2" title="問2" />
                    <ExamLinkButton url="2025/haru/3" title="問3" />
                    <ExamLinkButton url="2025/haru/4" title="問4" />
                </ExamListCard>

                <ExamListCard title="2024年(令和6年) 秋期">
                    <ExamLinkButton url="2024/aki/1" title="問1" />
                    <ExamLinkButton url="2024/aki/2" title="問2" />
                    <ExamLinkButton url="2024/aki/3" title="問3" />
                    <ExamLinkButton url="2024/aki/4" title="問4" />
                </ExamListCard>

                <ExamListCard title="2024年(令和6年) 春期">
                    <ExamLinkButton url="2024/haru/1" title="問1" />
                    <ExamLinkButton url="2024/haru/2" title="問2" />
                    <ExamLinkButton url="2024/haru/3" title="問3" />
                    <ExamLinkButton url="2024/haru/4" title="問4" />
                </ExamListCard>

                <ExamListCard title="2023年(令和5年) 秋期">
                    <ExamLinkButton url="2024/aki/1" title="問1" />
                    <ExamLinkButton url="2024/aki/2" title="問2" />
                    <ExamLinkButton url="2024/aki/3" title="問3" />
                    <ExamLinkButton url="2024/aki/4" title="問4" />
                </ExamListCard>
            </Flex>
        </Box>
    );
});
