import { Button } from "@chakra-ui/react";
import { ReactNode, FC, memo } from "react";

type Props = {
    children: ReactNode;
};

export const SubmitButton: FC<Props> = memo(({ children }) => {
    return (
        <Button
            type="submit"
            backgroundColor="baseColor"
            color="baseTextColor"
            w="100%"
            my={2}
            borderRadius="full"
            shadow="md"
        >
            {children}
        </Button>
    );
});
