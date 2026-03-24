import { Box, Center, CircularProgress, Text, VStack } from "@chakra-ui/react";
import { FC } from "react";

export const ChatLoadingSpinner: FC = () => {
    return (
        <Center mt="20px">
            <Box position="relative" w="240px" h="240px">
                <CircularProgress
                    isIndeterminate
                    color="green.200"
                    size="240px"
                    thickness="10px"
                />
                <Center
                    position="absolute"
                    inset="16px"
                    bg="white"
                    borderRadius="full"
                    boxShadow="lg"
                    px={6}
                    textAlign="center"
                >
                    <VStack spacing={1}>
                        <Text fontSize="lg" fontWeight="bold" lineHeight="tall">
                            AIがあなたの質問に回答しています。
                        </Text>
                        <Text fontSize="sm" color="gray.600" mt={4}>
                            回答には通常40~60秒かかります。
                        </Text>
                    </VStack>
                </Center>
            </Box>
        </Center>
    );
};
