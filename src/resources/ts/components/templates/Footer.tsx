import { Box } from "@chakra-ui/react";
import { FC, memo } from "react";

export const Footer: FC = memo(() => {
    return (
        <Box as="footer" w="100%" h="30px" textAlign="center" p="10px">
            © 2025 支援士AI添削アプリ
        </Box>
    );
});
