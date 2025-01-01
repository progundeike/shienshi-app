import { Box } from "@chakra-ui/react";
import { FC, memo } from "react";

export const Page404: FC = memo(() => {
    return (
        <Box mt="50px">
            <Box>ページが見つかりません。</Box>
        </Box>
    );
});
