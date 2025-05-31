import {
    Box,
    chakra,
    Heading,
    Table,
    TableCaption,
    TableContainer,
    Tbody,
    Td,
    Th,
    Tr,
} from "@chakra-ui/react";
import { memo } from "react";

import { ExamLinkButton } from "../atoms/ExamLinkButton";
import { EditExamLinkButton } from "../atoms/EditExamLinkButton";

const CustomTh = chakra(Th, {
    baseStyle: {
        textAlign: "center",
        fontSize: "lg",
    },
});

export const AdminPage = memo(() => {
    return (
        <Box w="80%" m="auto" textAlign="center">
            <Box m="20px">
                <Heading>問題編集ページ</Heading>
            </Box>
            <TableContainer>
                <Table variant="simple">
                    {/* <TableCaption placement="top">過去問一覧</TableCaption> */}
                    <Tbody>
                        <Tr>
                            <CustomTh>2024年(令和6年) 秋期</CustomTh>
                            <Td>
                                <EditExamLinkButton url="2024/aki/1">
                                    問1
                                </EditExamLinkButton>
                            </Td>
                            <Td>
                                <EditExamLinkButton url="2024/aki/2">
                                    問2
                                </EditExamLinkButton>
                            </Td>
                            <Td>
                                <EditExamLinkButton url="2024/aki/3">
                                    問3
                                </EditExamLinkButton>
                            </Td>
                            <Td>
                                <EditExamLinkButton url="2024/aki/4">
                                    問4
                                </EditExamLinkButton>
                            </Td>
                        </Tr>
                        <Tr>
                            <CustomTh>2024年(令和6年) 春期</CustomTh>
                            <Td>
                                <EditExamLinkButton url="2024/haru/1">
                                    問1
                                </EditExamLinkButton>
                            </Td>
                            <Td>
                                <EditExamLinkButton url="2024/haru/2">
                                    問2
                                </EditExamLinkButton>
                            </Td>
                            <Td>
                                <EditExamLinkButton url="2024/haru/3">
                                    問3
                                </EditExamLinkButton>
                            </Td>
                            <Td>
                                <EditExamLinkButton url="2024/haru/4">
                                    問4
                                </EditExamLinkButton>
                            </Td>
                        </Tr>
                        <Tr>
                            <CustomTh>2023年(令和5年) 秋期</CustomTh>
                            <Td>
                                <EditExamLinkButton url="2023/aki/1">
                                    問1
                                </EditExamLinkButton>
                            </Td>
                            <Td>
                                <EditExamLinkButton url="2023/aki/2">
                                    問2
                                </EditExamLinkButton>
                            </Td>
                            <Td>
                                <EditExamLinkButton url="2023/aki/3">
                                    問3
                                </EditExamLinkButton>
                            </Td>
                            <Td>
                                <EditExamLinkButton url="2023/aki/4">
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
                                <EditExamLinkButton url="2023/haru/1">
                                    問1
                                </EditExamLinkButton>
                            </Td>
                            <Td>
                                <EditExamLinkButton url="2023/haru/2">
                                    問2
                                </EditExamLinkButton>
                            </Td>
                            <Td borderRight={"1px solid black"}>
                                <EditExamLinkButton url="2023/haru/3">
                                    問3
                                </EditExamLinkButton>
                            </Td>
                            <Td>
                                <EditExamLinkButton url="2023/haru/4">
                                    問1
                                </EditExamLinkButton>
                            </Td>
                            <Td>
                                <EditExamLinkButton url="2023/haru/5">
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
