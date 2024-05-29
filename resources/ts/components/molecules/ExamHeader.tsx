import { Flex, Heading, Button, Box } from "@chakra-ui/react";
import { FC, memo } from "react";

export const ExamHeader: FC = memo(() => {
    return (
        <Box
            m="auto"
            w={{ base: "100%", md: "90%" }}
            maxW="1500px"
            p="5px"
            h="50px"
        >
            <Flex justifyContent="space-between" alignItems="center">
                <Heading as="h2" size="md">
                    令和5年 秋 午後問1
                </Heading>
                <Box>
                    <Button backgroundColor="green.200">
                        問題をダウンロード
                    </Button>
                </Box>
            </Flex>
        </Box>
    );
});
