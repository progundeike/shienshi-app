import {
    Box,
    Button,
    chakra,
    Heading,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Tr,
} from "@chakra-ui/react";
import { memo } from "react";

import { ExamLinkButton } from "../atoms/ExamLinkButton";
import { EditExamLinkButton } from "../atoms/EditExamLinkButton";
import { useAdmin } from "../../hooks/useAdmin";
import { useForm, Controller } from "react-hook-form";

const CustomTh = chakra(Th, {
    baseStyle: {
        textAlign: "center",
        fontSize: "lg",
    },
});

type UpdateExam = {
    year: number;
    season: "haru" | "aki";
    sectionCount: number;
};

export const AdminPage = memo(() => {
    return (
        <Box w="80%" m="auto" textAlign="center">
            <Box m="20px">
                <Heading>問題編集ページ</Heading>
            </Box>
            <TableContainer>
                <Table variant="simple">
                    <Tbody>
                        <Tr>
                            {/* 編集が終わったページのボタンの色はredからgreenに変える */}
                            <CustomTh>2099年(令和99年) 春季</CustomTh>
                            <Td>
                                <EditExamLinkButton
                                    url="2099/haru/1"
                                    color="red"
                                >
                                    問1
                                </EditExamLinkButton>
                            </Td>
                            <Td>
                                <EditExamLinkButton
                                    color="red"
                                    url="2099/haru/2"
                                >
                                    問2
                                </EditExamLinkButton>
                            </Td>
                            <Td>
                                <EditExamLinkButton
                                    color="red"
                                    url="2099/haru/3"
                                >
                                    問3
                                </EditExamLinkButton>
                            </Td>
                            <Td>
                                <EditExamLinkButton
                                    color="red"
                                    url="2099/haru/4"
                                >
                                    問4
                                </EditExamLinkButton>
                            </Td>
                        </Tr>
                        <Tr>
                            <CustomTh>2025年(令和7年) 春期</CustomTh>
                            <Td>
                                <EditExamLinkButton
                                    color="green"
                                    url="2025/haru/1"
                                >
                                    問1
                                </EditExamLinkButton>
                            </Td>
                            <Td>
                                <EditExamLinkButton
                                    color="red"
                                    url="2025/haru/2"
                                >
                                    問2
                                </EditExamLinkButton>
                            </Td>
                            <Td>
                                <EditExamLinkButton
                                    color="red"
                                    url="2025/haru/3"
                                >
                                    問3
                                </EditExamLinkButton>
                            </Td>
                            <Td>
                                <EditExamLinkButton
                                    color="red"
                                    url="2025/haru/4"
                                >
                                    問4
                                </EditExamLinkButton>
                            </Td>
                        </Tr>
                        <Tr>
                            <CustomTh>2024年(令和6年) 秋期</CustomTh>
                            <Td>
                                <EditExamLinkButton
                                    color="green"
                                    url="2024/aki/1"
                                >
                                    問1
                                </EditExamLinkButton>
                            </Td>
                            <Td>
                                <EditExamLinkButton
                                    color="green"
                                    url="2024/aki/2"
                                >
                                    問2
                                </EditExamLinkButton>
                            </Td>
                            <Td>
                                <EditExamLinkButton
                                    color="green"
                                    url="2024/aki/3"
                                >
                                    問3
                                </EditExamLinkButton>
                            </Td>
                            <Td>
                                <EditExamLinkButton
                                    color="green"
                                    url="2024/aki/4"
                                >
                                    問4
                                </EditExamLinkButton>
                            </Td>
                        </Tr>
                        <Tr>
                            <CustomTh>2024年(令和6年) 春期</CustomTh>
                            <Td>
                                <EditExamLinkButton
                                    color="green"
                                    url="2024/haru/1"
                                >
                                    問1
                                </EditExamLinkButton>
                            </Td>
                            <Td>
                                <EditExamLinkButton
                                    color="green"
                                    url="2024/haru/2"
                                >
                                    問2
                                </EditExamLinkButton>
                            </Td>
                            <Td>
                                <EditExamLinkButton
                                    color="green"
                                    url="2024/haru/3"
                                >
                                    問3
                                </EditExamLinkButton>
                            </Td>
                            <Td>
                                <EditExamLinkButton
                                    color="green"
                                    url="2024/haru/4"
                                >
                                    問4
                                </EditExamLinkButton>
                            </Td>
                        </Tr>
                        <Tr>
                            <CustomTh>2023年(令和5年) 秋期</CustomTh>
                            <Td>
                                <EditExamLinkButton
                                    color="green"
                                    url="2023/aki/1"
                                >
                                    問1
                                </EditExamLinkButton>
                            </Td>
                            <Td>
                                <EditExamLinkButton
                                    color="green"
                                    url="2023/aki/2"
                                >
                                    問2
                                </EditExamLinkButton>
                            </Td>
                            <Td>
                                <EditExamLinkButton
                                    color="green"
                                    url="2023/aki/3"
                                >
                                    問3
                                </EditExamLinkButton>
                            </Td>
                            <Td>
                                <EditExamLinkButton
                                    color="green"
                                    url="2023/aki/4"
                                >
                                    問4
                                </EditExamLinkButton>
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
                                <EditExamLinkButton
                                    color="red"
                                    url="2023/haru/1"
                                >
                                    問1
                                </EditExamLinkButton>
                            </Td>
                            <Td>
                                <EditExamLinkButton
                                    color="red"
                                    url="2023/haru/2"
                                >
                                    問2
                                </EditExamLinkButton>
                            </Td>
                            <Td borderRight={"1px solid black"}>
                                <EditExamLinkButton
                                    color="red"
                                    url="2023/haru/3"
                                >
                                    問3
                                </EditExamLinkButton>
                            </Td>
                            <Td>
                                <EditExamLinkButton
                                    color="red"
                                    url="2023/haru/4"
                                >
                                    問1
                                </EditExamLinkButton>
                            </Td>
                            <Td>
                                <EditExamLinkButton
                                    color="red"
                                    url="2023/haru/5"
                                >
                                    問2
                                </EditExamLinkButton>
                            </Td>
                        </Tr>
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    );
});
