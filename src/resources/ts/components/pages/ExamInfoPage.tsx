import { Box } from "@chakra-ui/react";
import { FC } from "react";
import { ExamSystemTransitionSection } from "../organisms/top-page/ExamSystemTransitionSection";

export const ExamInfoPage: FC = () => {
    return (
        <Box maxW="1200px" w="100%" mx="auto" my="50px" px={{ base: 4, md: 6 }}>
            <ExamSystemTransitionSection />
        </Box>
    );
};
