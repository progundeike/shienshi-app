import React, { FC, memo } from "react";
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
        <Box w="80%" m="auto">
            <TableContainer>
                <Table variant="simple">
                    <TableCaption placement="top">過去問一覧</TableCaption>
                    <Tbody>
                        <Tr>
                            <CustomTh>2024年(令和6年) 春期</CustomTh>
                            <Td>
                                <PreReleaseExamLinkButton url="2024/haru/1">
                                    問1
                                </PreReleaseExamLinkButton>
                            </Td>
                            <Td>
                                <PreReleaseExamLinkButton url="2024/haru/2">
                                    問2
                                </PreReleaseExamLinkButton>
                            </Td>
                            <Td>
                                <PreReleaseExamLinkButton url="2024/haru/3">
                                    問3
                                </PreReleaseExamLinkButton>
                            </Td>
                            <Td>
                                <PreReleaseExamLinkButton url="2024/haru/4">
                                    問4
                                </PreReleaseExamLinkButton>
                            </Td>
                            <Td>
                                <PreReleaseExamLinkButton url="2024/haru/5">
                                    問5
                                </PreReleaseExamLinkButton>
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
                                <PreReleaseExamLinkButton url="2023/aki/2">
                                    問2
                                </PreReleaseExamLinkButton>
                            </Td>
                            <Td>
                                <PreReleaseExamLinkButton url="2023/aki/3">
                                    問3
                                </PreReleaseExamLinkButton>
                            </Td>
                            <Td>
                                <PreReleaseExamLinkButton url="2023/aki/4">
                                    問4
                                </PreReleaseExamLinkButton>
                            </Td>
                            <Td>
                                <PreReleaseExamLinkButton url="2023/aki/5">
                                    問5
                                </PreReleaseExamLinkButton>
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
                            <Td>
                                <PreReleaseExamLinkButton url="2023/haru/3">
                                    問3
                                </PreReleaseExamLinkButton>
                            </Td>
                            <Td>
                                <PreReleaseExamLinkButton url="2023/haru/4">
                                    問4
                                </PreReleaseExamLinkButton>
                            </Td>
                            <Td>
                                <PreReleaseExamLinkButton url="2023/haru/5">
                                    問5
                                </PreReleaseExamLinkButton>
                            </Td>
                        </Tr>
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    );
});
