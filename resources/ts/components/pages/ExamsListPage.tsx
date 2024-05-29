import React from "react";
import {
    Box,
    Table,
    TableCaption,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";

export const ExamsListPage = () => {
    return (
        <Box w="80%" m="auto">
            <TableContainer>
                <Table variant="simple">
                    <TableCaption placement="top">試験一覧</TableCaption>
                    <Tbody>
                        <Tr>
                            <Th>2024年(令和6年) 春期</Th>
                            <Td>問1</Td>
                            <Td>問2</Td>
                            <Td>問3</Td>
                            <Td>問4</Td>
                            <Td>問5</Td>
                        </Tr>
                        <Tr>
                            <Th>2023年(令和5年) 秋期</Th>
                            <Td>問1</Td>
                            <Td>問2</Td>
                            <Td>問3</Td>
                            <Td>問4</Td>
                            <Td>問5</Td>
                        </Tr>
                        <Tr>
                            <Th>2023年(令和5年) 春期</Th>
                            <Td>午後1 問1</Td>
                            <Td>午後1 問2</Td>
                            <Td>午後1 問3</Td>
                            <Td>午後2 問1</Td>
                            <Td>午後2 問2</Td>
                        </Tr>
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    );
};
