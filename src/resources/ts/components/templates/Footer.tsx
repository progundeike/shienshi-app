import { Box } from "@chakra-ui/react";
import { FC, memo } from "react";

export const Footer: FC = memo(() => {
    return (
        <Box as="footer" w="100%" h="30px" textAlign="center" m="5px">
            © 2026 支援士対策室
        </Box>
    );
});
