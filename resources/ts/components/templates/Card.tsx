import { Stack } from "@chakra-ui/react";
import { FC, memo } from "react";

type Props = {
    children: React.ReactNode;
    maxW: string;
};

export const Card: FC<Props> = memo(({ children, maxW }) => {
    return (
        <Stack
            w="full"
            maxW={{ base: "100%", md: maxW }}
            backgroundColor="white"
            mx="auto"
            my="20px"
            rounded="lg"
            boxShadow="lg"
            p="20px"
            spacing={6}
            borderRadius="10px"
        >
            {children}
        </Stack>
    );
});
