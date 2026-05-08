import { Box, Button, Flex } from "@chakra-ui/react";
import { memo } from "react";
import { Link } from "react-router-dom";

export const AdminPage = memo(() => {
    return (
        <Box w="80%" m="auto" textAlign="center" my="30px" p="50px">
            <Flex direction="column" gap="30px">
                <Box>
                    <Button
                        as={Link}
                        to="/admin/news-item"
                        colorScheme="green"
                        borderRadius="full"
                        w="50%"
                    >
                        お知らせ編集
                    </Button>
                </Box>

                <Box>
                    <Button
                        as={Link}
                        to="/admin/inquiry"
                        colorScheme="green"
                        borderRadius="full"
                        w="50%"
                    >
                        お問い合わせ確認
                    </Button>
                </Box>

                <Box>
                    <Button
                        as={Link}
                        to="/admin/exams"
                        colorScheme="green"
                        borderRadius="full"
                        w="50%"
                    >
                        問題編集
                    </Button>
                </Box>
            </Flex>
        </Box>
    );
});
