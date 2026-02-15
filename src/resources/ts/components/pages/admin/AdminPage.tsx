import { Box, Button, Flex } from "@chakra-ui/react";
import { memo } from "react";
import { Link } from "react-router-dom";

export const AdminPage = memo(() => {
    return (
        <Box w="80%" m="auto" textAlign="center" my="30px" p="50px">
            <Flex direction="column" gap="30px">
                <Box>
                    <Link to="/admin/news-item">
                        <Button colorScheme="green" borderRadius="full" w="50%">
                            お知らせ編集
                        </Button>
                    </Link>
                </Box>

                <Box>
                    <Link to="/admin/inquiry">
                        <Button colorScheme="green" borderRadius="full" w="50%">
                            お問い合わせ確認
                        </Button>
                    </Link>
                </Box>

                <Box>
                    <Link to="/admin/exams">
                        <Button colorScheme="green" borderRadius="full" w="50%">
                            問題編集
                        </Button>
                    </Link>
                </Box>
            </Flex>
        </Box>
    );
});
