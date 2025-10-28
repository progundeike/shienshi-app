import React, { FC, memo, ReactNode } from "react";
import {
    Box,
    chakra,
    Table,
    TableCaption,
    TableContainer,
    Tbody,
    Td,
    Th,
    Tr,
    Text,
    Heading,
} from "@chakra-ui/react";
import { ExamLinkButton } from "../atoms/ExamLinkButton";
import { PreReleaseExamLinkButton } from "../atoms/PreReleaseExamLinkButton";

const CustomTh = chakra(Th, {
    baseStyle: {
        textAlign: "center",
        fontSize: "lg",
    },
});

export const ExamsListPage: FC = memo(() => {
    return (
        <Box w="80%" m="auto" textAlign="center">
            <Box m="20px">
                <Heading>過去問一覧</Heading>
            </Box>
            <TableContainer>
                <Table variant="simple">
                    <Tbody>
                        <Tr>
                            <CustomTh>2025年(令和7年) 春期</CustomTh>
                            <Td>
                                <ExamLinkButton url="2025/haru/1">
                                    問1
                                </ExamLinkButton>
                            </Td>
                            <Td>
                                <ExamLinkButton url="2025/haru/2">
                                    問2
                                </ExamLinkButton>
                            </Td>
                            <Td>
                                <ExamLinkButton url="2025/haru/3">
                                    問3
                                </ExamLinkButton>
                            </Td>
                            <Td>
                                <ExamLinkButton url="2025/haru/4">
                                    問4
                                </ExamLinkButton>
                            </Td>
                        </Tr>
                        <Tr>
                            <CustomTh>2024年(令和6年) 秋期</CustomTh>
                            <Td>
                                <ExamLinkButton url="2024/aki/1">
                                    問1
                                </ExamLinkButton>
                            </Td>
                            <Td>
                                <ExamLinkButton url="2024/aki/2">
                                    問2
                                </ExamLinkButton>
                            </Td>
                            <Td>
                                <ExamLinkButton url="2024/aki/3">
                                    問3
                                </ExamLinkButton>
                            </Td>
                            <Td>
                                <ExamLinkButton url="2024/aki/4">
                                    問4
                                </ExamLinkButton>
                            </Td>
                        </Tr>
                        <Tr>
                            <CustomTh>2024年(令和6年) 春期</CustomTh>
                            <Td>
                                <ExamLinkButton url="2024/haru/1">
                                    問1
                                </ExamLinkButton>
                            </Td>
                            <Td>
                                <ExamLinkButton url="2024/haru/2">
                                    問2
                                </ExamLinkButton>
                            </Td>
                            <Td>
                                <ExamLinkButton url="2024/haru/3">
                                    問3
                                </ExamLinkButton>
                            </Td>
                            <Td>
                                <ExamLinkButton url="2024/haru/4">
                                    問4
                                </ExamLinkButton>
                            </Td>
                        </Tr>
                        <Tr>
                            <CustomTh>2023年(令和5年) 秋期</CustomTh>
                            <Td>
                                <ExamLinkButton url="2023/aki/1">
                                    問1
                                </ExamLinkButton>
                            </Td>
                            <Td>
                                <ExamLinkButton url="2023/aki/2">
                                    問2
                                </ExamLinkButton>
                            </Td>
                            <Td>
                                <ExamLinkButton url="2023/aki/3">
                                    問3
                                </ExamLinkButton>
                            </Td>
                            <Td>
                                <ExamLinkButton url="2023/aki/4">
                                    問4
                                </ExamLinkButton>
                            </Td>
                            <Td></Td>
                        </Tr>
                        <Tr>
                            <Td></Td>
                            <Td colSpan={3} fontSize="md" textAlign="center">
                                午後1
                            </Td>
                            <Td colSpan={2} fontSize="md" textAlign="center">
                                午後2
                            </Td>
                        </Tr>
                        <Tr>
                            <CustomTh>2023年(令和5年) 春期</CustomTh>
                            <Td>
                                <PreReleaseExamLinkButton url="2023/haru/1">
                                    問1
                                </PreReleaseExamLinkButton>
                            </Td>
                            <Td>
                                <PreReleaseExamLinkButton url="2023/haru/2">
                                    問2
                                </PreReleaseExamLinkButton>
                            </Td>
                            <Td borderRight={"1px solid black"}>
                                <PreReleaseExamLinkButton url="2023/haru/3">
                                    問3
                                </PreReleaseExamLinkButton>
                            </Td>
                            <Td>
                                <PreReleaseExamLinkButton url="2023/haru/4">
                                    問1
                                </PreReleaseExamLinkButton>
                            </Td>
                            <Td>
                                <PreReleaseExamLinkButton url="2023/haru/5">
                                    問2
                                </PreReleaseExamLinkButton>
                            </Td>
                        </Tr>
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    );
});
