import { Button } from "@chakra-ui/react";
import { ReactNode, FC, memo } from "react";

type Props = {
    children: ReactNode;
};

export const SubmitButton: FC<Props> = memo(({ children }) => {
    return (
        <Button
            type="submit"
            backgroundColor="green.400"
            color="white"
            w="100%"
            my="10px"
            borderRadius="full"
        >
            {children}
        </Button>
    );
});
