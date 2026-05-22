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
        fontSize: { base: "sm", md: "lg" },
        px: { base: 1, md: 4 },
        py: { base: 2, md: 3 },
        // whiteSpace: "nowrap",
    },
});

const CustomTd = chakra(Td, {
    baseStyle: {
        textAlign: "center",
        px: { base: 0, md: 4 },
        py: { base: 2, md: 3 },
    },
});

export const DesktopExamTable: FC = memo(() => {
    return (
        <TableContainer>
            <Table variant="simple" size="sm">
                <Tbody>
                    <Tr>
                        <CustomTh>2025年(令和7年) 秋期</CustomTh>
                        <CustomTd>
                            <PreReleaseExamLinkButton
                                url="2025/aki/1"
                                title="問1"
                            />
                        </CustomTd>
                        <CustomTd>
                            <PreReleaseExamLinkButton
                                url="2025/aki/2"
                                title="問2"
                            />
                        </CustomTd>
                        <CustomTd>
                            <PreReleaseExamLinkButton
                                url="2025/aki/3"
                                title="問3"
                            />
                        </CustomTd>
                        <CustomTd>
                            <PreReleaseExamLinkButton
                                url="2025/aki/4"
                                title="問4"
                            />
                        </CustomTd>
                    </Tr>
                    <Tr>
                        <CustomTh>2025年(令和7年) 春期</CustomTh>
                        <CustomTd>
                            <ExamLinkButton url="2025/haru/1" title="問1" />
                        </CustomTd>
                        <CustomTd>
                            <ExamLinkButton url="2025/haru/2" title="問2" />
                        </CustomTd>
                        <CustomTd>
                            <ExamLinkButton url="2025/haru/3" title="問3" />
                        </CustomTd>
                        <CustomTd>
                            <ExamLinkButton url="2025/haru/4" title="問4" />
                        </CustomTd>
                    </Tr>
                    <Tr>
                        <CustomTh>2024年(令和6年) 秋期</CustomTh>
                        <CustomTd>
                            <ExamLinkButton url="2024/aki/1" title="問1" />
                        </CustomTd>
                        <CustomTd>
                            <ExamLinkButton url="2024/aki/2" title="問2" />
                        </CustomTd>
                        <CustomTd>
                            <ExamLinkButton url="2024/aki/3" title="問3" />
                        </CustomTd>
                        <CustomTd>
                            <ExamLinkButton url="2024/aki/4" title="問4" />
                        </CustomTd>
                    </Tr>

                    <Tr>
                        <CustomTh>2024年(令和6年) 春期</CustomTh>
                        <CustomTd>
                            <ExamLinkButton url="2024/haru/1" title="問1" />
                        </CustomTd>
                        <CustomTd>
                            <ExamLinkButton url="2024/haru/2" title="問2" />
                        </CustomTd>
                        <CustomTd>
                            <ExamLinkButton url="2024/haru/3" title="問3" />
                        </CustomTd>
                        <CustomTd>
                            <ExamLinkButton url="2024/haru/4" title="問4" />
                        </CustomTd>
                    </Tr>
                    <Tr>
                        <CustomTh>2023年(令和5年) 秋期</CustomTh>
                        <CustomTd>
                            <ExamLinkButton url="2023/aki/1" title="問1" />
                        </CustomTd>
                        <CustomTd>
                            <ExamLinkButton url="2023/aki/2" title="問2" />
                        </CustomTd>
                        <CustomTd>
                            <ExamLinkButton url="2023/aki/3" title="問3" />
                        </CustomTd>
                        <CustomTd>
                            <ExamLinkButton url="2023/aki/4" title="問4" />
                        </CustomTd>
                    </Tr>

                    {/* 以下は午前、午後で計5問あった年 */}
                    <Tr>
                        <CustomTd></CustomTd>
                        <CustomTd colSpan={3} fontSize="md" textAlign="center">
                            午後1
                        </CustomTd>
                        <CustomTd colSpan={2} fontSize="md" textAlign="center">
                            午後2
                        </CustomTd>
                    </Tr>
                    <Tr>
                        <CustomTh>2023年(令和5年) 春期</CustomTh>
                        <CustomTd>
                            <PreReleaseExamLinkButton
                                url="2023/haru/1"
                                title="問1"
                            />
                        </CustomTd>
                        <CustomTd>
                            <PreReleaseExamLinkButton
                                url="2023/haru/2"
                                title="問2"
                            />
                        </CustomTd>
                        <CustomTd borderRight={"1px solid black"}>
                            <PreReleaseExamLinkButton
                                url="2023/haru/3"
                                title="問3"
                            />
                        </CustomTd>
                        <CustomTd>
                            <PreReleaseExamLinkButton
                                url="2023/haru/4"
                                title="問1"
                            />
                        </CustomTd>
                        <CustomTd>
                            <PreReleaseExamLinkButton
                                url="2023/haru/5"
                                title="問2"
                            />
                        </CustomTd>
                    </Tr>
                </Tbody>
            </Table>
        </TableContainer>
    );
});
