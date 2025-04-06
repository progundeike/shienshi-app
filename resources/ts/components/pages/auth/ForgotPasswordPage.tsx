import { Box } from "@chakra-ui/react";
import { FC, memo } from "react";

export const ForgotPasswordPage: FC = memo(() => {
    return (
        <Box w="80%" m="20px auto">
            登録されたメールアドレスにリセットパスワードのメールを送信するページ
        </Box>
    );
});
