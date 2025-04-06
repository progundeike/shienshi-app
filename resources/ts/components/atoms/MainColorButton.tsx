import { Button } from "@chakra-ui/react";
import { ReactNode, FC, memo } from "react";

type Props = {
    children: ReactNode;
};

export const MainColorButton: FC<Props> = memo(({ children }) => {
    return (
        <Button
            backgroundColor="baseColor"
            color="baseTextColor"
            w="100%"
            my="10px"
            borderRadius="full"
            shadow="md"
        >
            {children}
        </Button>
    );
});
