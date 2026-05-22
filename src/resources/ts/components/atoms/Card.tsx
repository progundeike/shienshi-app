import { Box } from "@chakra-ui/react";
import { FC, memo, ReactNode } from "react";

type Props = {
    children: ReactNode;
    w?: string;
};

export const Card: FC<Props> = memo(({ children, w }) => {
    return (
        <Box
            backgroundColor="white"
            borderRadius={5}
            border="1px solid"
            borderColor="#CCCCCC"
            textAlign="center"
            shadow="md"
            p={{ base: 4, md: 7 }}
            w={w ? w : "100%"}
        >
            {children}
        </Box>
    );
});
