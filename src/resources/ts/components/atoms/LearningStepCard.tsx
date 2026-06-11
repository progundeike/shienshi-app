import { Box } from "@chakra-ui/react";
import { FC, memo } from "react";

export const LearningStepCard: FC<{ children: React.ReactNode }> = memo(
    ({ children }) => {
        return (
            <Box flex="1">
                <Box
                    h="100%"
                    w="100%"
                    bg="white"
                    borderRadius={5}
                    border="1px solid"
                    borderColor="#CCCCCC"
                    textAlign="left"
                    shadow="md"
                    p={7}
                >
                    {children}
                </Box>
            </Box>
        );
    },
);
