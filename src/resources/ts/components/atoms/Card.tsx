import { Box } from "@chakra-ui/react";
import { FC, memo, ReactNode } from "react";

type Props = {
    children: ReactNode;
};

export const Card: FC<Props> = memo(({ children }) => {
    return (
        <Box
            backgroundColor="white"
            borderRadius="20px"
            border="1px solid"
            borderColor="#CCCCCC"
            textAlign="center"
            shadow="md"
            p="30px"
        >
            {children}
        </Box>
    );
});
