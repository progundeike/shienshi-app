import { memo, FC } from "react";
import { Button, Icon } from "@chakra-ui/react";
import { useAuth } from "../../hooks/useAuth";

export const LogoutButton: FC = memo(() => {
    const { logout } = useAuth();
    return (
        <>
            <Button
                onClick={() => logout()}
                color="black"
                borderRadius="full"
                px="20px"
                shadow="md"
                outline={"1px solid"}
            >
                ログアウト
            </Button>
        </>
    );
});
