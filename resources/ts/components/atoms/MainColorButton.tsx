import { Button } from "@chakra-ui/react";
import { ReactNode, FC, memo } from "react";

type Props = {
    children: ReactNode;
    type?: "button" | "submit" | "reset";
};

export const MainColorButton: FC<Props> = memo(({ children, type }) => {
    return (
        <Button
            backgroundColor="baseColor"
            color="baseTextColor"
            w="100%"
            my="10px"
            borderRadius="full"
            shadow="md"
            type={type}
        >
            {children}
        </Button>
    );
});
