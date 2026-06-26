import { memo, FC, useState } from "react";
import { Button } from "@chakra-ui/react";
import { LuLogOut } from "react-icons/lu";

import { useAuth } from "../../hooks/useAuth";

export const LogoutButton: FC = memo(() => {
    const { logout } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const onLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logout();
        } finally {
            setIsLoggingOut(false);
        }
    };
    return (
        <>
            <Button
                onClick={onLogout}
                isLoading={isLoggingOut}
                bg="white"
                color="black"
                borderRadius="full"
                px="20px"
                shadow="md"
                border="1px solid"
                borderColor="baseColor"
                size={{ base: "sm", md: "md" }}
                leftIcon={<LuLogOut />}
            >
                ログアウト
            </Button>
        </>
    );
});
