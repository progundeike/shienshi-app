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
            my={5}
            rounded="lg"
            boxShadow="lg"
            p={5}
            spacing={6}
            borderRadius="xl"
        >
            {children}
        </Stack>
    );
});
