import React, { FC, memo, ReactNode } from "react";
import { Box, Text, Heading, Flex, Grid } from "@chakra-ui/react";
import { ExamLinkButton } from "../atoms/ExamLinkButton";
import { PreReleaseExamLinkButton } from "../atoms/PreReleaseExamLinkButton";

const ExamListCard: FC<{
    title: string;
    children: React.ReactNode;
}> = ({ title, children }) => {
    return (
        <Box
            bg="white"
            border="0.5px solid"
            p="10px"
            m="10px"
            borderRadius="md"
        >
            <Box mb="8px">
                <Text>{title}</Text>
            </Box>
            <Flex gap="10px">{children}</Flex>
        </Box>
    );
};

export const MobileExamsList: FC = memo(() => {
    return (
        <Box textAlign="center" mx="auto">
            <Flex direction="column">
                <ExamListCard title="2025年(令和7年) 秋期">
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
                    <ExamLinkButton url="2023/aki/1" title="問1" />
                    <ExamLinkButton url="2023/aki/2" title="問2" />
                    <ExamLinkButton url="2023/aki/3" title="問3" />
                    <ExamLinkButton url="2023/aki/4" title="問4" />
                </ExamListCard>

                <ExamListCard title="2023年(令和5年) 春期">
                    <Grid
                        templateColumns="auto repeat(3, 1fr)"
                        w="100%"
                        gap="10px"
                        alignItems="center"
                    >
                        <Text whiteSpace="nowrap">午前</Text>
                        <ExamLinkButton url="2023/haru/1" title="問1" />
                        <ExamLinkButton url="2023/haru/2" title="問2" />
                        <ExamLinkButton url="2023/haru/3" title="問3" />

                        <Text whiteSpace="nowrap">午後</Text>
                        <ExamLinkButton url="2023/haru/4" title="問1" />
                        <ExamLinkButton url="2023/haru/5" title="問2" />
                    </Grid>
                </ExamListCard>
            </Flex>
        </Box>
    );
});
