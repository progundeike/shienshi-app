import { FC, memo } from "react";
import { Box, Button } from "@chakra-ui/react";
import { LogoutButton } from "../atoms/LogoutButton";

export const MyPage: FC = memo(() => {
    return (
        <Box>
            ここがマイページ
            <LogoutButton />
        </Box>
    );
});
