import { FC, memo } from "react";
import { Box, Button } from "@chakra-ui/react";
import { LogoutButton } from "../atoms/LogoutButton";
import { useRecoilValue } from "recoil";
import { userAtom } from "../../states/userAtom";
import { useNavigate } from "react-router-dom";

export const MyPage: FC = memo(() => {
    const user = useRecoilValue(userAtom);
    const navigate = useNavigate();

    if (!user) {
        navigate("/login");
        return;
    }

    return (
        <Box>
            <LogoutButton />

            {!user.emailVerified && (
                <Box>
                    メールアドレスが未登録です。メールアドレスを登録することで、パスワードを忘れてしまっても再設定が可能になります。
                </Box>
            )}

            <Box>{user.username}さんの学習履歴</Box>
            <Box>ここに学習履歴を表示する</Box>
        </Box>
    );
});
