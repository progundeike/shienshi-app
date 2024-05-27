import { Box } from "@chakra-ui/react";
import { FC, memo } from "react";

export const Footer: FC = memo(() => {
    return (
        <Box
            as="footer"
            w="100%"
            h="50px"
            bg="gray.500"
            textAlign="center"
            p="10px"
        >
            ここがフッター
        </Box>
    );
});
