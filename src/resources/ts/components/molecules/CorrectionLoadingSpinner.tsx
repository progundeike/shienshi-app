import { Box, Center, CircularProgress, Text, VStack } from "@chakra-ui/react";
import { FC } from "react";

export const CorrectionLoadingSpinner: FC = () => {
    return (
        <Center mt="20px">
            <Box position="relative" w="300px" h="300px">
                <CircularProgress
                    isIndeterminate
                    color="green.200"
                    size="300px"
                    thickness="10px"
                />
                <Center
                    position="absolute"
                    inset="20px"
                    bg="white"
                    borderRadius="full"
                    boxShadow="lg"
                    px={8}
                    textAlign="center"
                >
                    <VStack spacing={3}>
                        <Text fontSize="sm" color="gray.600" mb={2}>
                            採点処理中
                        </Text>
                        <Text fontSize="xl" fontWeight="bold" lineHeight="tall">
                            お疲れ様でした!
                            <br />
                            AIがあなたの答案を添削しています。
                        </Text>
                        <Text fontSize="sm" color="gray.600" mt={5}>
                            添削には通常40~60秒かかります。
                        </Text>
                    </VStack>
                </Center>
            </Box>
        </Center>
    );
};
