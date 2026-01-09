import { Box, Text } from "@chakra-ui/react";
import { FC, memo } from "react";

export const Page404: FC = memo(() => {
    return (
        <Box mt="50px" minH="100px" textAlign="center">
            <Text fontSize="6xl" fontWeight="bold" mb="20px">
                404 Not Found
            </Text>
            <Text>ページが見つかりませんでした。</Text>
        </Box>
    );
});
