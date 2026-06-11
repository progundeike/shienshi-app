import { memo, FC } from "react";
import { Button } from "@chakra-ui/react";
import { useAuth } from "../../hooks/useAuth";
import { LuLogOut } from "react-icons/lu";

export const LogoutButton: FC = memo(() => {
    const { logout } = useAuth();
    return (
        <>
            <Button
                onClick={() => logout()}
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
