import { Button, ButtonProps } from "@chakra-ui/react";
import { FC, memo } from "react";

export const SubmitButton: FC<ButtonProps> = memo(
    ({ children, ...buttonProps }) => {
        return (
            <Button
                type="submit"
                backgroundColor="baseColor"
                color="baseTextColor"
                w="100%"
                my={2}
                borderRadius="full"
                shadow="md"
                {...buttonProps}
            >
                {children}
            </Button>
        );
    },
);
