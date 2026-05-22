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
import { DesktopExamTable } from "../organisms/DesktopExamTable";
import { MobileExamsList } from "../organisms/MobileExamsList";

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

export const ExamsListPage: FC = memo(() => {
    return (
        <Box w={{ base: "100%", md: "80%" }} m="auto" textAlign="center">
            <Box m="20px">
                <Heading>過去問一覧</Heading>
            </Box>
            <Box display={{ base: "none", md: "block" }}>
                <DesktopExamTable />
            </Box>

            <Box display={{ base: "block", md: "none" }}>
                <MobileExamsList />
            </Box>
        </Box>
    );
});
