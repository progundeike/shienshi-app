import React, { FC, memo } from "react";
import {
    Box,
    Button,
    chakra,
    Table,
    TableCaption,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import { ExamLinkButton } from "../atoms/ExamLinkButton";

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
                            <Td>問1</Td>
                            <Td>問2</Td>
                            <Td>問3</Td>
                            <Td>問4</Td>
                            <Td>問5</Td>
                        </Tr>
                        <Tr>
                            <CustomTh>2023年(令和5年) 秋期</CustomTh>
                            <Td>
                                <ExamLinkButton url="2023/aki/1">
                                    問1
                                </ExamLinkButton>
                            </Td>
                            <Td>問2</Td>
                            <Td>問3</Td>
                            <Td>問4</Td>
                            <Td>問5</Td>
                        </Tr>
                        <Tr>
                            <CustomTh>2023年(令和5年) 春期</CustomTh>
                            <Td>午後Ⅰ 問1</Td>
                            <Td>午後I 問2</Td>
                            <Td>午後I 問3</Td>
                            <Td>午後Ⅱ 問1</Td>
                            <Td>午後Ⅱ 問2</Td>
                        </Tr>
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    );
});
